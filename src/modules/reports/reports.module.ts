import { Module } from '@nestjs/common';
import { TrialbalanceModule } from './trialbalance/trialbalance.module';
import { LedgerModule } from './ledger/ledger.module';

@Module({
  imports: [TrialbalanceModule, LedgerModule]
})
export class ReportsModule {}
