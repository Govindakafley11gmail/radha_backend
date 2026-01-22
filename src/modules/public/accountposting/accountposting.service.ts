import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AccountTransaction } from '../general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from '../general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountGroup } from 'src/modules/master/account_group/entities/account_group.entity';

export interface CostEntry {
  accountId: string;
  debit: number;
  credit: number;
  referenceType?: string;
  referenceId?: string;
  accountTypeName?: string; // e.g. GST Input, Inventory, Expense
  description?: string;
}

@Injectable()
export class AccountpostingService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(AccountTransaction)
    private readonly transactionRepo: Repository<AccountTransaction>,

    @InjectRepository(AccountTransactionDetail)
    private readonly detailRepo: Repository<AccountTransactionDetail>,

    @InjectRepository(AccountType)
    private readonly accountTypeRepo: Repository<AccountType>,
  ) {}

  /**
   * Generic cost posting with auto account type & group resolution
   */
  async postCosts(
    batchId: string,
    voucherNo: string,
    description: string,
    costEntries: CostEntry[],
  ) {
    if (!costEntries?.length) return null;

    return this.dataSource.transaction(async (manager) => {
      // 1️⃣ Calculate voucher amount
      const voucherAmount = costEntries.reduce(
        (sum, e) => sum + Math.max(e.debit, e.credit),
        0,
      );

      // 2️⃣ Create transaction header
      const transaction = manager.create(AccountTransaction, {
        transactionDate: new Date(),
        voucher_no: voucherNo,
        accountId: costEntries[0]?.accountId || '',
        voucher_amount: voucherAmount,
        description,
        referenceId: batchId,
      });

      await manager.save(transaction);

      const details: AccountTransactionDetail[] = [];

      // 3️⃣ Create transaction details
      for (const entry of costEntries) {
        let accountType: AccountType | null = null;
        let accountGroup: AccountGroup | null = null;

        if (entry.accountTypeName) {
          const type = await manager.findOne(AccountType, {
            where: { name: entry.accountTypeName },
            relations: ['group'],
          });

          if (type) {
            accountType = { id: type.id } as AccountType;
            if (type.group) {
              accountGroup = { id: type.group.id } as AccountGroup;
            }
          }
        }

        const detail = manager.create(AccountTransactionDetail, {
          transaction: transaction,              // ✅ relation object
          accountId: entry.accountId,
          debit: entry.debit,
          credit: entry.credit,
          description: entry.accountTypeName,
          accountType: accountType ?? undefined, // ✅ relation object
          accountGroup: accountGroup ?? undefined,
        });

        details.push(detail);
      }

      // 4️⃣ Save details
      await manager.save(AccountTransactionDetail, details);

      return {
        transaction,
        details,
      };
    });
  }

  // ---------------- CRUD ----------------

  async findAll(): Promise<AccountTransaction[]> {
    return this.transactionRepo.find({
      relations: ['details', 'details.accountType', 'details.accountGroup'],
      order: { transactionDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AccountTransaction> {
    const tx = await this.transactionRepo.findOne({
      where: { id },
      relations: ['details', 'details.accountType', 'details.accountGroup'],
    });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }

  async remove(id: string): Promise<void> {
    const tx = await this.findOne(id);
    await this.transactionRepo.remove(tx);
  }
}
