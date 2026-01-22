import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CostEntryDto {
  @IsString()
  accountId: string;

  @IsOptional()
  debit?: number;

  @IsOptional()
  credit?: number;

  @IsOptional()
  referenceType?: string;

  @IsOptional()
  referenceId?: string;
}

export class CreateAccountpostingDto {
  @IsString()
  batchId: string;

  @IsOptional()
  voucherNo?: string;

  @IsOptional()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CostEntryDto)
  costEntries: CostEntryDto[];
}
