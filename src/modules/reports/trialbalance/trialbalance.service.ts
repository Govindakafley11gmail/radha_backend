/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';

@Injectable()
export class TrialService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * TRIAL BALANCE REPORT (ERP Standard)
   * - Debit = total debit per account
   * - Credit = total credit per account
   * - No balance conversion (pure accounting view)
   */
  async generateTrialBalance(startDate?: string, endDate?: string) {
    try {
      const qb = this.dataSource
        .getRepository(AccountTransactionDetail)
        .createQueryBuilder('d')
        .innerJoin('d.transaction', 't')
        .innerJoin('d.accountType', 'a')
        .where('d.isDeleted = false')
        .andWhere('t.isDeleted = false');

      // ✅ Date filters
      if (startDate) {
        qb.andWhere('t.transactionDate >= :startDate', { startDate });
      }

      if (endDate) {
        qb.andWhere('t.transactionDate <= :endDate', { endDate });
      }

      // ✅ Aggregation (ERP standard)
      qb.select('a.id', 'accountId')
        .addSelect('a.name', 'accountName')
        .addSelect('SUM(COALESCE(d.debit, 0))', 'totalDebit')
        .addSelect('SUM(COALESCE(d.credit, 0))', 'totalCredit')
        .groupBy('a.id')
        .addGroupBy('a.name')
        .orderBy('a.name', 'ASC');

      const rows = await qb.getRawMany();

      // ✅ Map results
      const accounts = rows.map((r) => {
        const debit = Number(r.totalDebit) || 0;
        const credit = Number(r.totalCredit) || 0;

        return {
          accountId: r.accountId,
          accountName: r.accountName,
          debit,
          credit,
        };
      });

      // ✅ Totals
      const totalDebit = accounts.reduce(
        (sum, a) => sum + a.debit,
        0,
      );

      const totalCredit = accounts.reduce(
        (sum, a) => sum + a.credit,
        0,
      );

      return {
        reportType: 'TRIAL_BALANCE',
        generatedAt: new Date(),
        dateRange: {
          startDate: startDate ?? null,
          endDate: endDate ?? null,
        },
        totals: {
          debit: totalDebit,
          credit: totalCredit,
          difference: totalDebit - totalCredit,
        },
        
        isBalanced: totalDebit === totalCredit,
        accounts,
      };
    } catch (error) {
      console.error('Trial Balance Error:', error);
      throw new InternalServerErrorException(
        'Failed to generate trial balance',
      );
    }
  }
}