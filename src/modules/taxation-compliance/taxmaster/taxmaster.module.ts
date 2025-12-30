import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxMaster } from './entities/taxmaster.entity';
import { TaxInvoice } from '../taxinvoice/entities/taxinvoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaxMaster, TaxInvoice]), // 👈 register both
  ],
  exports: [TypeOrmModule],
})
export class TaxationModule {}
