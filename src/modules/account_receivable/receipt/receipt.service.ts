/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt, ReceiptStatus } from './entities/receipt.entity';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { ReceiptPDFService } from './receiptPDFServices';
import { Response } from 'express';
import { SalesInvoice } from '../sales-invoice/entities/sales-invoice.entity';
import { Customer } from '../customer/entities/customer.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,
    private readonly pdfService: ReceiptPDFService,

    @InjectRepository(SalesInvoice)
    private readonly invoiceRepo: Repository<SalesInvoice>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>, // ✅ This line
  ) { }

  /* ================= CREATE ================= */
  async create(createReceiptDto: CreateReceiptDto): Promise<Receipt> {
    const queryRunner = this.receiptRepo.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const lastReceipt = await this.receiptRepo.findOne({
        where: {},
        order: { created_at: 'DESC' },
      });

      // Assume lastReceipt is the object you got
      let nextNumber = 1;

      if (lastReceipt && lastReceipt.receipt_number) {
        // Split by '-' and get the last part
        const parts = lastReceipt.receipt_number.split('-');
        const lastNumStr = parts[parts.length - 1];
        const lastNum = parseInt(lastNumStr, 10);

        if (!isNaN(lastNum)) {
          nextNumber = lastNum + 1;
        }
      }

      // Generate new receipt number, e.g., RCPT-20251226-0004
      const receiptNumber = `RCPT-${datePart}-${String(nextNumber).padStart(4, '0')}`;
      const invoice = await this.invoiceRepo.findOne({ where: { id: createReceiptDto.sales_invoice_id } });
      if (!invoice) throw new NotFoundException('Invoice not found');

      const customer = await this.customerRepo.findOne({ where: { customer_id: createReceiptDto.customer_id } });
      if (!customer) throw new NotFoundException('Customer not found');
      // 1️⃣ Save Receipt
      const receipt = queryRunner.manager.create(Receipt, {
        ...createReceiptDto,
        receipt_number: receiptNumber,
        status: ReceiptStatus.DRAFT,
        salesInvoice: invoice,
        customer: customer,
        
      });
      const savedReceipt = await queryRunner.manager.save(receipt);


      // 2️⃣ Save Account Transaction
      const transaction = queryRunner.manager.create(AccountTransaction, {
        reference_type: 'RECEIPT',
        accountId: savedReceipt.id,
        reference_id: savedReceipt.id,
        transactionDate: savedReceipt.receipt_date, // ✅ this was missing
        voucher_amount: savedReceipt.amount_received,
        voucher_no: receiptNumber,
        description: `Receipt for Invoice ID: ${savedReceipt.sales_invoice_id}`,
        status: 'POSTED',
        createdBy: 'system',
        updatedBy: 'system',
      });
      const savedTransaction = await queryRunner.manager.save(transaction);

      let debitAccountName: string;

      switch (savedReceipt.payment_method) {
        case 'CASH':
          debitAccountName = 'Cash';
          break;
        case 'BANK':
        case 'CHEQUE':
          debitAccountName = 'Bank';
          break;
        case 'ONLINE':
          debitAccountName = 'Bank';
          break;
        default:
          throw new BadRequestException('Invalid payment method');
      }
      // 3️⃣ Fetch account types from DB
      const accountTypes = await this.accountTypeRepository.find({
        where: [
          { name: 'Accounts Receivable' },
          { name: debitAccountName },
        ],
        relations: ['group'],
      });

      // 4️⃣ Map names to IDs
      const accountMap: Record<string, { id: string; groupId?: string }> = {};
      accountTypes.forEach(acc => {
        accountMap[acc.name] = {
          id: acc.id,
          groupId: acc.group?.id,
        };
      });
      // 5️⃣ Create GL mappings

      const glMappings = [
        {
          accountTypeID: accountMap[debitAccountName].id,
          groupId: accountMap[debitAccountName].groupId,
          debit: savedReceipt.amount_received,
          credit: 0,
          description: `${savedReceipt.payment_method} received`,
        },
        {
          accountTypeID: accountMap['Accounts Receivable'].id,
          groupId: accountMap['Accounts Receivable'].groupId,
          debit: 0,
          credit: savedReceipt.amount_received,
          description: `Reduce AR for Invoice ID: ${savedReceipt.sales_invoice_id}`,
        },
      ];
      // 6️⃣ Save Account Transaction Details
      const transactionDetails = glMappings.map(line => {
        return queryRunner.manager.create(AccountTransactionDetail, {
          transaction: savedTransaction,
          accountId: savedReceipt.id,
          accountGroup: line.groupId ? { id: line.groupId } : undefined,   // relation object
          accountType: line.accountTypeID ? { id: line.accountTypeID } : undefined, // relation object
          debit: line.debit,
          credit: line.credit,
          description: line.description,
        });
      });

      // Save all details
      await queryRunner.manager.save(transactionDetails);


      // 7️⃣ Update Receipt status
      savedReceipt.status = ReceiptStatus.POSTED;
      await queryRunner.manager.save(savedReceipt);

      await queryRunner.commitTransaction();
      return savedReceipt;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }



  /* ================= FIND ALL ================= */
  async findAll(): Promise<Receipt[]> {
    return this.receiptRepo.find({
      where: { isDeleted: false },
      order: { receipt_date: 'DESC' },
    });
  }

  /* ================= FIND ONE ================= */
  async findOne(id: string): Promise<Receipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['customer', 'salesInvoice'],
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    return receipt;
  }

  /* ================= UPDATE ================= */
  async update(
    id: string,
    updateReceiptDto: UpdateReceiptDto,
  ): Promise<Receipt> {
    const receipt = await this.findOne(id);

    if (receipt.status === ReceiptStatus.POSTED) {
      throw new BadRequestException(
        'Posted receipt cannot be updated',
      );
    }

    Object.assign(receipt, updateReceiptDto);

    return await this.receiptRepo.save(receipt);
  }


  /* ================= CANCEL RECEIPT ================= */
  /* ================= CANCEL RECEIPT ================= */
  async cancelReceipt(id: string): Promise<Receipt> {
    const queryRunner = this.receiptRepo.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const receipt = await this.findOne(id);

      if (receipt.status !== ReceiptStatus.POSTED) {
        throw new BadRequestException('Only posted receipts can be cancelled');
      }

      // 1️⃣ Find the original transaction for this receipt
      const transaction = await queryRunner.manager.findOne(AccountTransaction, {
        where: { id: receipt.id },
        relations: ['details'],
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found for this receipt');
      }

      // 2️⃣ Reverse transaction details
      const reversedDetails = transaction.details.map(detail =>
        queryRunner.manager.create(AccountTransactionDetail, {
          transaction: transaction,         // link to the same transaction
          accountId: detail.accountId,
          accountGroup: detail.accountGroup ? { id: detail.accountGroup.id } : undefined,
          accountType: detail.accountType ? { id: detail.accountType.id } : undefined,
          debit: detail.credit,            // swap debit and credit
          credit: detail.debit,
          description: `[Reversal] ${detail.description}`,
          isDeleted: true,
        }),
      );

      await queryRunner.manager.save(reversedDetails);

      // 3️⃣ Optionally mark the original transaction as CANCELLED
      transaction.isDeleted = true;
      await queryRunner.manager.save(transaction);

      // 4️⃣ Update receipt status
      receipt.status = ReceiptStatus.CANCELLED;
      await queryRunner.manager.save(receipt);

      await queryRunner.commitTransaction();
      return receipt;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async generateReceipt(id: string, res: any): Promise<any> {
    const receipt = await this.findOne(id);
    await this.pdfService.generatePDF(receipt, res);

    return receipt;
  }

}
