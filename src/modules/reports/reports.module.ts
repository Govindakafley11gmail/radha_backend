import { Module } from '@nestjs/common';
import { TrialbalanceModule } from './trialbalance/trialbalance.module';
import { LedgerModule } from './ledger/ledger.module';
import { PurchaseInvoiceReportModule } from './purchase-invoice-report/purchase-invoice-report.module';

@Module({
  imports: [TrialbalanceModule, LedgerModule, PurchaseInvoiceReportModule]
})
export class ReportsModule {}
