import { Module } from '@nestjs/common';
import { TrialbalanceModule } from './trialbalance/trialbalance.module';
import { LedgerModule } from './ledger/ledger.module';
import { PurchaseInvoiceReportModule } from './purchase-invoice-report/purchase-invoice-report.module';
import { ProfitLossAccountModule } from './profit-loss-account/profit-loss-account.module';
import { InventoryReportModule } from './inventory-report/inventory-report.module';
import { BalanceSheetModule } from './balance-sheet/balance-sheet.module';

@Module({
  imports: [TrialbalanceModule, LedgerModule, PurchaseInvoiceReportModule, ProfitLossAccountModule, ProfitLossAccountModule, InventoryReportModule, BalanceSheetModule]
})
export class ReportsModule {}
