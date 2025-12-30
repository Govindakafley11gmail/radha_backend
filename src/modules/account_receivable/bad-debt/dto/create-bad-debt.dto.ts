import { IsUUID, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateBadDebtDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  salesInvoiceId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  write_off_date?: string;
}
