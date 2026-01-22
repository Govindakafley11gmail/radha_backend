import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { LedgerReportService } from './ledger.service';
import { LedgerReportDto } from './dto/create-ledger.dto';
import { LedgerPDFService } from './ledgerrepost';
import { LedgerExcelService } from './ledger_excel_report';


@Controller('ledger')
export class LedgerController {
  constructor(
    private readonly ledgerService: LedgerReportService,
    private readonly ledgerPDFService: LedgerPDFService, // 🔹 inject PDF service
        private readonly ledgerExcelService: LedgerExcelService, // 🔹 inject Excel service

  ) {}

  /**
   * Ledger Report PDF (Body-based)
   */
  @Post()
  async getLedgerReportPDF(
    @Body() body: LedgerReportDto,
    @Res() res: Response, // 🔹 Express response for PDF streaming
  ) {
    const { accountTypeId, accountGroupId, startDate, endDate } = body;
    // 🔹 Wait for ledger report data
    const reportData = await this.ledgerService.generateLedgerReport(
      accountTypeId,
      accountGroupId,
      startDate,
      endDate,
    );
    console.log('LedgerController -> getLedgerReportPDF -> reportData', reportData);

    // 🔹 Generate PDF and send via response
      return body.format === 'PDF' ? this.ledgerPDFService.generatePDF(reportData, res) : this.ledgerExcelService.generateExcel(reportData, res);
  }
}
