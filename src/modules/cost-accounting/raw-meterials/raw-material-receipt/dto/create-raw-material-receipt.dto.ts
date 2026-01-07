import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer'; // <-- import Type

export class CreateRawMaterialReceiptDto {
 

  @IsNotEmpty()
  @IsString()
  supplier_id: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // <-- convert to number
  total_cost?: number;

  @IsNotEmpty()
  @IsString()
  purchase_invoice_id: string;

  @IsString()
  paymentMode?: string;

   @IsString()
  accountNo?: string;

  @IsOptional()
  @IsDateString()
  received_date?: string;

  @IsOptional()
  @IsString()
  payment_remarks: string;
}
