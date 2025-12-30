import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BadDebt } from './entities/bad-debt.entity';
import { CreateBadDebtDto } from './dto/create-bad-debt.dto';
import { UpdateBadDebtDto } from './dto/update-bad-debt.dto';
import { Customer } from '../customer/entities/customer.entity';
import { SalesInvoice } from '../sales-invoice/entities/sales-invoice.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';


@Injectable()
export class BadDebtService {
  constructor(
    @InjectRepository(BadDebt)
    private readonly badDebtRepo: Repository<BadDebt>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(SalesInvoice)
    private readonly salesInvoiceRepo: Repository<SalesInvoice>,
    @InjectRepository(AccountTransaction)
    private readonly accountTxnRepo: Repository<AccountTransaction>,
    @InjectRepository(AccountTransactionDetail)
    private readonly accountTxnDetailRepo: Repository<AccountTransactionDetail>,
    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>,
    private readonly dataSource: DataSource,
  ) {}

  // Create BadDebt + Accounting
  async create(createBadDebtDto: CreateBadDebtDto): Promise<BadDebt> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer = await this.customerRepo.findOne({ where: { customer_id: createBadDebtDto.customerId } });
      if (!customer) throw new NotFoundException('Customer not found');

      const invoice = await this.salesInvoiceRepo.findOne({ where: { id: createBadDebtDto.salesInvoiceId } });
      if (!invoice) throw new NotFoundException('Sales Invoice not found');

      // 1️⃣ Create BadDebt
      const badDebt = this.badDebtRepo.create({
        customer,
        salesInvoice: invoice,
        amount: createBadDebtDto.amount,
        reason: createBadDebtDto.reason,
        write_off_date: createBadDebtDto.write_off_date,
      });
      const savedBadDebt = await queryRunner.manager.save(badDebt);

      // 2️⃣ Create AccountTransaction (GL header)
      const accountTransaction = queryRunner.manager.create(AccountTransaction, {
        accountId: savedBadDebt.id,
        transactionDate: createBadDebtDto.write_off_date || new Date(),
        voucher_amount: savedBadDebt.amount,
        voucher_no: `BDW-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(1000 + Math.random() * 9000)}`,
        description: `Bad Debt Write-off for Invoice ID: ${invoice.id}`,
        status: 'POSTED',
        createdBy: 'system',
        updatedBy: 'system',
      });

      const savedTransaction = await queryRunner.manager.save(accountTransaction);
      // 3️⃣ Fetch GL accounts
      const accountTypes = await this.accountTypeRepository.find({
        where: [{ name: 'Bad Debt & Provision' }, { name: 'Accounts Receivable' }],
        relations: ['group'],
      });

      const accountMap: Record<string, { id: string; groupId?: string }> = {};
      accountTypes.forEach(acc => {
        accountMap[acc.name] = { id: acc.id, groupId: acc.group?.id };
      });
      // 4️⃣ Create transaction details
      const glMappings = [
        {
          accountTypeID: accountMap['Bad Debt & Provision'].id,
          groupId: accountMap['Bad Debt & Provision'].groupId,
          debit: savedBadDebt.amount,
          credit: 0,
          description: 'Bad Debt Expense',
        },
        {
          accountTypeID: accountMap['Accounts Receivable'].id,
          groupId: accountMap['Accounts Receivable'].groupId,
          debit: 0,
          credit: savedBadDebt.amount,
          description: `Reduce AR for Invoice ID: ${invoice.id}`,
        },
      ];

      const transactionDetails = glMappings.map(line =>
        queryRunner.manager.create(AccountTransactionDetail, {
          transaction: savedTransaction,
          accountId: badDebt.id,
          accountType: line.accountTypeID ? { id: line.accountTypeID } : undefined,
          accountGroup: line.groupId ? { id: line.groupId } : undefined,
          debit: line.debit,
          credit: line.credit,
          description: line.description,
        }),
      );

      await queryRunner.manager.save(transactionDetails);

      await queryRunner.commitTransaction();
      return savedBadDebt;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Get all BadDebts
  async findAll(): Promise<BadDebt[]> {
    return this.badDebtRepo.find({ relations: ['customer', 'salesInvoice'] });
  }

  // Get one BadDebt
  async findOne(id: string): Promise<BadDebt> {
    const badDebt = await this.badDebtRepo.findOne({ where: { id }, relations: ['customer', 'salesInvoice'] });
    if (!badDebt) throw new NotFoundException(`BadDebt with ID ${id} not found`);
    return badDebt;
  }

  // Update BadDebt
  async update(id: string, updateBadDebtDto: UpdateBadDebtDto): Promise<BadDebt> {
    const badDebt = await this.findOne(id);

    if (updateBadDebtDto.customerId) {
      const customer = await this.customerRepo.findOne({ where: { customer_id: updateBadDebtDto.customerId } });
      if (!customer) throw new NotFoundException('Customer not found');
      badDebt.customer = customer;
    }

    if (updateBadDebtDto.salesInvoiceId) {
      const invoice = await this.salesInvoiceRepo.findOne({ where: { id: updateBadDebtDto.salesInvoiceId } });
      if (!invoice) throw new NotFoundException('Sales Invoice not found');
      badDebt.salesInvoice = invoice;
    }

    Object.assign(badDebt, updateBadDebtDto);
    return this.badDebtRepo.save(badDebt);
  }

  // Remove/Cancel BadDebt + Reverse Accounting
  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const badDebt = await this.findOne(id);

      // 1️⃣ Reverse accounting if posted
      const transaction = await this.accountTxnRepo.findOne({
        where: { id: badDebt.id },
        relations: ['details'],
      });

      if (transaction) {
        // Create reversal entries
        const reversalDetails = transaction.details.map(d => {
          return queryRunner.manager.create(AccountTransactionDetail, {
            transaction,
            accountType: { id: d.accountType ? d.accountType.id : '' },
            accountGroup: d.accountGroup ? { id: d.accountGroup.id } : undefined,
            debit: d.credit,
            credit: d.debit,
            description: `Reversal: ${d.description}`,
          });
        });
        await queryRunner.manager.save(reversalDetails);
        transaction.isDeleted = true;
        await queryRunner.manager.save(transaction);
      }

      // 2️⃣ Delete BadDebt record
      await queryRunner.manager.delete(BadDebt, { id: badDebt.id });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
