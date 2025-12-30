import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxinvoiceService } from './taxinvoice.service';
import { TaxinvoiceController } from './taxinvoice.controller';
import { TaxInvoice } from './entities/taxinvoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxInvoice])],
  controllers: [TaxinvoiceController],
  providers: [TaxinvoiceService],
  exports: [TaxinvoiceService], // export if other modules need it
})
export class TaxinvoiceModule {}
