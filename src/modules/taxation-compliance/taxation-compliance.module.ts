import { Module } from '@nestjs/common';
import { TaxinvoiceModule } from './taxinvoice/taxinvoice.module';
import { TaxationModule } from './taxmaster/taxmaster.module';

@Module({
  imports: [TaxationModule, TaxinvoiceModule]
})
export class TaxationComplianceModule {}
