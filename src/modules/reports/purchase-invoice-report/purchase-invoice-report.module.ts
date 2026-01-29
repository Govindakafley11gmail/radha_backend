import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseInvoiceReportController } from './purchase-invoice-report.controller';
import { PurchaseInvoiceReportService } from './purchase-invoice-report.service';
import { PurchaseInvoiceReportPDFService } from './purchase_invoice_report';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseInvoice]),
  ],
  controllers: [PurchaseInvoiceReportController],
  providers: [
    PurchaseInvoiceReportService,
    PurchaseInvoiceReportPDFService, // ✅ ADD THIS
  ],
})
export class PurchaseInvoiceReportModule {}
