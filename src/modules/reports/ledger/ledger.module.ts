import { Module } from '@nestjs/common';
import { LedgerReportService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { LedgerPDFService } from './ledgerrepost';
import { LedgerExcelService } from './ledger_excel_report';

@Module({
  controllers: [LedgerController],
  providers: [LedgerReportService,LedgerPDFService,LedgerExcelService],
})
export class LedgerModule {}
