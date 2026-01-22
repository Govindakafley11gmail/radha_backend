import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';

@Injectable()
export class LedgerReportService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async generateLedgerReport(
    accountTypeId: string,
    accountGroupId?: string,
    startDate?: string,
    endDate?: string,
  ) {
    // Build query
    const qb = this.dataSource
      .getRepository(AccountTransactionDetail)
      .createQueryBuilder('d')
      .innerJoinAndSelect('d.transaction', 't')  // load transaction entity
      .innerJoinAndSelect('d.accountType', 'a'); // load accountType entity

    // Filter by account type

    qb.innerJoinAndSelect('a.group', 'g')
      .andWhere('g.id = :accountGroupId', { accountGroupId });
    // Filter by account group if provided
    if (accountTypeId) {

      qb.where('a.id = :accountTypeId', { accountTypeId })
        .andWhere('d.isDeleted = false')
        .andWhere('t.isDeleted = false');
    }

    // Filter by date range if provided
    if (startDate) qb.andWhere('t.transactionDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('t.transactionDate <= :endDate', { endDate });

    qb.orderBy('t.transactionDate', 'ASC');

    // Execute query
    const transactions = await qb.getMany();
    console.log('LedgerReportService -> generateLedgerReport -> transactions', transactions);
    // Handle empty transactions
    if (!transactions) {
      return {
        reportType: 'LEDGER_REPORT',
        generatedAt: new Date(),
        ledger: { id: accountTypeId, name: 'Unknown', group: null, openingBalance: 0 },
        dateRange: { startDate: startDate ?? null, endDate: endDate ?? null },
        totals: { debit: 0, credit: 0 },
        isBalanced: true,
        accounts: [],
      };
    }

    // Compute running balance
    let runningBalance = 0;
    const accounts = transactions.map((t) => {
      const debit = Number(t.debit ?? 0);
      const credit = Number(t.credit ?? 0);
      runningBalance += debit - credit;

      return {
        date: t.transaction.transactionDate,
        particular: t.transaction.description ?? '',
        debit,
        credit,
        balance: runningBalance,
      };
    });
    // Calculate totals
    const totalDebit = accounts.reduce((sum, a) => sum + a.debit, 0);
    const totalCredit = accounts.reduce((sum, a) => sum + a.credit, 0);
    console.log('LedgerReportService -> generateLedgerReport -> totalDebit, totalCredit', totalDebit, totalCredit);
    // Build report
    const data = {
      reportType: 'LEDGER_REPORT',
      generatedAt: new Date(),
      ledger: {
        id: accountTypeId,
        name: transactions[0].accountType?.name ?? 'Unknown',
        group: transactions[0].accountType?.group?.name ?? null,
        openingBalance: 0, // You can implement opening balance logic here
      },
      dateRange: { startDate: startDate ?? null, endDate: endDate ?? null },
      totals: { debit: totalDebit, credit: totalCredit },
      isBalanced: totalDebit === totalCredit,
      accounts,
    };
    return data;
  }
}
