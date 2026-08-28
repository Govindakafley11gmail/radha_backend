/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';

@Injectable()
export class ProfitLossAccountService {
  constructor(
    @InjectRepository(AccountTransactionDetail)
    private readonly detailRepo: Repository<AccountTransactionDetail>,
  ) {}

  async getProfitLoss(startDate: string, endDate: string) {
    const data = await this.detailRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.accountGroup', 'g')
      .leftJoinAndSelect('d.accountType', 'at')
      .leftJoin('d.transaction', 't')
      .where('t.transactionDate BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .andWhere('d.isDeleted = false')
      .andWhere('t.isDeleted = false')
      .getMany();

    // ===================== TOTALS =====================
    let sales = 0;
    let expenses = 0;

    // ===================== GROUPED MAP =====================
    const expenseMap: Record<
      string,
      { accountType: string; amount: number }
    > = {};

    const incomeMap: Record<
      string,
      { accountType: string; amount: number }
    > = {};

    // ===================== PROCESS =====================
    for (const item of data) {
      const groupName = item.accountGroup?.name || '';
      const accountType = item.accountType?.name || 'Unknown';

      const debit = Number(item.debit || 0);
      const credit = Number(item.credit || 0);

      // ===================== INCOME =====================
      if (groupName === 'Income') {
        const amount = credit - debit;
        sales += amount;

        if (!incomeMap[accountType]) {
          incomeMap[accountType] = {
            accountType,
            amount: 0,
          };
        }

        incomeMap[accountType].amount += amount;
      }

      // ===================== EXPENSE =====================
      else if (groupName === 'Expenses') {
        const amount = debit - credit;
        expenses += amount;

        if (!expenseMap[accountType]) {
          expenseMap[accountType] = {
            accountType,
            amount: 0,
          };
        }

        expenseMap[accountType].amount += amount;
      }
    }

    // ===================== FINAL ARRAYS =====================
    const incomeList = Object.values(incomeMap);
    const expenseList = Object.values(expenseMap);
   
    const netProfit = (sales - expenses);

    return {
      period: {
        startDate,
        endDate,
      },

      // INCOME
      sales,
      incomeList,

      // EXPENSES (GROUPED + SUMMED)
      expenses,
      expenseList,

      // RESULT
      netProfit,
      status: sales > expenses ? 'PROFIT' : 'LOSS',
    };
  }
}