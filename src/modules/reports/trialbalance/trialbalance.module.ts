import { Module } from '@nestjs/common';
import { TrialService } from './trialbalance.service';
import { TrialbalanceController } from './trialbalance.controller';
import { TrialBalancePDFService } from './trialbalancepdfservices';

@Module({
  controllers: [TrialbalanceController],
  providers: [TrialService,    TrialBalancePDFService, // ✅ add it here
],
})
export class TrialbalanceModule {}
