import { IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaxInvoiceDto {
  @IsString()
  customerId: string;

  @IsString()
  invoiceNumber: string;

  @IsDate()
  @Type(() => Date)
  invoiceDate: Date;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  taxAmount: number;
}
