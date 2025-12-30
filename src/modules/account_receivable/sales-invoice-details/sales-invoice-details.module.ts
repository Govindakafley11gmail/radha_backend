import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesInvoiceDetailsService } from './sales-invoice-details.service';
import { SalesInvoiceDetailsController } from './sales-invoice-details.controller';
import { SalesInvoiceDetail } from './entities/sales-invoice-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesInvoiceDetail])],
  controllers: [SalesInvoiceDetailsController],
  providers: [SalesInvoiceDetailsService],
  exports: [SalesInvoiceDetailsService],
})
export class SalesInvoiceDetailsModule {}
