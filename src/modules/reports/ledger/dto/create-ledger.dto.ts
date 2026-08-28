// dto/ledger-report.dto.ts
import { Type } from 'class-transformer';
import {  IsDate, IsOptional, IsString } from 'class-validator';

export class LedgerReportDto {
  @IsString()
  accountTypeId!: string;

  @IsOptional()
  @IsString()
  accountGroupId?: string;

  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  format?: 'PDF' | 'EXCEL';
}
