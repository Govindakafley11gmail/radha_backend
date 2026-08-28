import { Controller, Post, Body } from '@nestjs/common';
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
  ) {
    const { accountTypeId, accountGroupId, startDate, endDate } = body;
    // 🔹 Wait for ledger report data
    const reportData = await this.ledgerService.generateLedgerReport(
      accountTypeId,
      accountGroupId,
      startDate,
      endDate,
    );
   return reportData;
  }
}
