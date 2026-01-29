/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PurchaseInvoiceReportService } from './purchase-invoice-report.service';
import { PurchaseInvoiceReportPDFService } from './purchase_invoice_report';
type PurchaseInvoiceReportDto = {
  invoiceNo: string,
  supplierName: string,
  fromDate: string,
  toDate: string,
  status: string,
}

@Controller('purchase-invoice-report')
export class PurchaseInvoiceReportController {
  constructor(
    private readonly purchaseInvoiceReportService: PurchaseInvoiceReportService,
    private readonly pdfService: PurchaseInvoiceReportPDFService,
  ) {}

  @Post()
  async searchAndGeneratePdf(
    @Body() createPurchaseInvoiceDto: PurchaseInvoiceReportDto,
    @Res() res: Response,
  ) {
    const { invoiceNo, supplierName, fromDate, toDate, status } =
      createPurchaseInvoiceDto;

    // ✅ MUST await
    const invoices = await this.purchaseInvoiceReportService.findAll({
      invoiceNo,
      supplierName,
      fromDate,
      toDate,
      status,
    });
// return invoices;
    // ✅ Pass real data + res
    return this.pdfService.generatePDF(
      invoices,
      createPurchaseInvoiceDto,
      res,
    );
  }
}
