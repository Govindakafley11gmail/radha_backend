import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateSalesReturnDto {
  @IsUUID()
  @IsNotEmpty()
  salesInvoiceId: string;

  @IsDateString()
  return_date: Date;

  @IsNumber()
  quantity: number;

  @IsNumber()
  amount: number;
}
