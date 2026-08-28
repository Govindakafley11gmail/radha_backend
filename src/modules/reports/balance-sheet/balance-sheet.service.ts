/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';

export interface BalanceSheetItem {
  accountId: string;
  accountName: string;
  groupName: string;
  balance: number;
}

export interface BalanceSheetSection {
  items: BalanceSheetItem[];
  total: number;
}

export interface BalanceSheetReport {
  reportType: string;
  generatedAt: Date;
  asOfDate: string | null;
  assets: {
    current: BalanceSheetSection;
    nonCurrent: BalanceSheetSection;
    total: number;
  };
  liabilities: {
    current: BalanceSheetSection;
    nonCurrent: BalanceSheetSection;
    total: number;
  };
  equity: BalanceSheetSection;
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  unclassified: BalanceSheetSection;
}

/**
 * ✅ Adjust these keywords to match your actual account_groups.name values.
 * Run this to see your group names: SELECT DISTINCT name FROM account_groups;
 * Then add your group names to the correct array below.
 */
const CURRENT_ASSET_GROUPS = [
  'cash', 'bank', 'receivable', 'inventory', 'prepaid', 'current asset',
];

const NON_CURRENT_ASSET_GROUPS = [
  'fixed asset', 'property', 'plant', 'equipment', 'intangible',
  'goodwill', 'investment', 'non current asset', 'noncurrent asset',
];

const CURRENT_LIABILITY_GROUPS = [
  'payable', 'accrued', 'short term', 'current liability', 'overdraft',
  'deferred revenue',
];

const NON_CURRENT_LIABILITY_GROUPS = [
  'long term', 'bond', 'deferred tax', 'lease', 'non current liability',
  'noncurrent liability',
];

const EQUITY_GROUPS = [
  'equity', 'capital', 'retained', 'reserve', 'share premium',
  'other comprehensive', 'shareholder',
];

const INCOME_GROUPS = [
  'income', 'revenue', 'sales', 'gain',
];

const EXPENSE_GROUPS = [
  'expense', 'cost', 'loss', 'depreciation', 'amortization',
];

function classify(groupName: string): string {
  const lower = (groupName ?? '').toLowerCase();
  if (CURRENT_ASSET_GROUPS.some((k) => lower.includes(k)))         return 'currentAsset';
  if (NON_CURRENT_ASSET_GROUPS.some((k) => lower.includes(k)))     return 'nonCurrentAsset';
  if (CURRENT_LIABILITY_GROUPS.some((k) => lower.includes(k)))     return 'currentLiability';
  if (NON_CURRENT_LIABILITY_GROUPS.some((k) => lower.includes(k))) return 'nonCurrentLiability';
  if (EQUITY_GROUPS.some((k) => lower.includes(k)))                return 'equity';
  if (INCOME_GROUPS.some((k) => lower.includes(k)))                return 'income';
  if (EXPENSE_GROUPS.some((k) => lower.includes(k)))               return 'expense';
  return 'unclassified';
}

@Injectable()
export class BalanceSheetService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async generateBalanceSheet(asOfDate?: string): Promise<BalanceSheetReport> {
    try {
      // ── Exact same query pattern as your working trial balance ────────────
      const qb = this.dataSource
        .getRepository(AccountTransactionDetail)
        .createQueryBuilder('d')
        .innerJoin('d.transaction', 't')
        .innerJoin('d.accountGroup', 'g')
        .innerJoin('d.accountType', 'a')
        .where('d.isDeleted = false')
        .andWhere('t.isDeleted = false');

      if (asOfDate) {
        qb.andWhere('t.transactionDate <= :asOfDate', { asOfDate });
      }

      qb.select('a.id', 'accountId')
        .addSelect('a.name', 'accountName')
        .addSelect('g.name', 'groupName')
        .addSelect('SUM(COALESCE(d.debit,  0))', 'totalDebit')
        .addSelect('SUM(COALESCE(d.credit, 0))', 'totalCredit')
        .groupBy('a.id')
        .addGroupBy('a.name')
        .addGroupBy('g.id')
        .addGroupBy('g.name')
        .orderBy('g.name', 'ASC')
        .addOrderBy('a.name', 'ASC');

      const rows = await qb.getRawMany();

      // ── Section containers ────────────────────────────────────────────────
      const currentAssets:         BalanceSheetItem[] = [];
      const nonCurrentAssets:      BalanceSheetItem[] = [];
      const currentLiabilities:    BalanceSheetItem[] = [];
      const nonCurrentLiabilities: BalanceSheetItem[] = [];
      const equity:                BalanceSheetItem[] = [];
      const unclassified:          BalanceSheetItem[] = [];

      let incomeTotal  = 0;
      let expenseTotal = 0;

      // ── Classify each account by groupName keyword ────────────────────────
      for (const r of rows) {
        const debit   = Number(r.totalDebit)  || 0;
        const credit  = Number(r.totalCredit) || 0;
        const section = classify(r.groupName);

        // Assets & Expenses are debit-nature:  balance = debit - credit
        // Liabilities, Equity & Income are credit-nature: balance = credit - debit
        const isDebitNature =
          section === 'currentAsset' ||
          section === 'nonCurrentAsset' ||
          section === 'expense';

        const balance = isDebitNature ? debit - credit : credit - debit;

        const item: BalanceSheetItem = {
          accountId:   r.accountId,
          accountName: r.accountName,
          groupName:   r.groupName,
          balance,
        };

        switch (section) {
          case 'currentAsset':        currentAssets.push(item);         break;
          case 'nonCurrentAsset':     nonCurrentAssets.push(item);      break;
          case 'currentLiability':    currentLiabilities.push(item);    break;
          case 'nonCurrentLiability': nonCurrentLiabilities.push(item); break;
          case 'equity':              equity.push(item);                 break;
          case 'income':              incomeTotal  += balance;           break;
          case 'expense':             expenseTotal += balance;           break;
          default:                    unclassified.push(item);           break;
        }
      }

      // ── Net profit goes into Equity as Current Year Earnings ──────────────
      const netProfit = incomeTotal - expenseTotal;
      equity.push({
        accountId:   '0',
        accountName: 'Current Year Earnings',
        groupName:   'Equity',
        balance:     netProfit,
      });

      // ── Totals ────────────────────────────────────────────────────────────
      const sum = (items: BalanceSheetItem[]) =>
        items.reduce((acc, i) => acc + i.balance, 0);

      const totalCurrentAssets         = sum(currentAssets);
      const totalNonCurrentAssets      = sum(nonCurrentAssets);
      const totalCurrentLiabilities    = sum(currentLiabilities);
      const totalNonCurrentLiabilities = sum(nonCurrentLiabilities);
      const totalEquity                = sum(equity);
      const totalUnclassified          = sum(unclassified);

      const totalAssets               = totalCurrentAssets + totalNonCurrentAssets;
      const totalLiabilities          = totalCurrentLiabilities + totalNonCurrentLiabilities;
      const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

      const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

      if (!isBalanced) {
        console.warn(
          `[BalanceSheet] Off by: ${(totalAssets - totalLiabilitiesAndEquity).toFixed(2)}`,
        );
      }

      if (unclassified.length > 0) {
        console.warn(
          `[BalanceSheet] Unclassified groups (add to keyword arrays):`,
          [...new Set(unclassified.map((u) => u.groupName))],
        );
      }

      return {
        reportType:  'BALANCE_SHEET',
        generatedAt: new Date(),
        asOfDate:    asOfDate ?? null,
        assets: {
          current:    { items: currentAssets,         total: totalCurrentAssets },
          nonCurrent: { items: nonCurrentAssets,      total: totalNonCurrentAssets },
          total:      totalAssets,
        },
        liabilities: {
          current:    { items: currentLiabilities,    total: totalCurrentLiabilities },
          nonCurrent: { items: nonCurrentLiabilities, total: totalNonCurrentLiabilities },
          total:      totalLiabilities,
        },
        equity: {
          items: equity,
          total: totalEquity,
        },
        totalLiabilitiesAndEquity,
        isBalanced,
        unclassified: { items: unclassified, total: totalUnclassified },
      };
    } catch (error) {
      console.error('Balance Sheet Error:', error);
      throw new InternalServerErrorException(
        'Failed to generate balance sheet',
      );
    }
  }
}