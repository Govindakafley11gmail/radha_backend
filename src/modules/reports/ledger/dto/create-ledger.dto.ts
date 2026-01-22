// dto/ledger-report.dto.ts
import {  IsOptional, IsString } from 'class-validator';

export class LedgerReportDto {
  @IsString()
  accountTypeId: string;

  @IsOptional()
  @IsString()
  accountGroupId?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  format?: 'PDF' | 'EXCEL';
}
