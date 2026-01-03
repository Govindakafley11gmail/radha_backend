import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer'; // <-- import Type

export class CreateRawMaterialReceiptDto {
  @IsNotEmpty()
  @IsString()
  raw_material_id: string;

  @IsNotEmpty()
  @IsString()
  supplier_id: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // <-- convert to number
  gst_tax_amount?: number;

  @IsNotEmpty()
  @IsString()
  purchase_invoice_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity_received: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  total_unit_cost: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  freight_cost?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  import_duty?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  scrap_quantity?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  total_cost: number;

  @IsOptional()
  @IsDateString()
  received_date?: string;

  @IsOptional()
  @IsString()
  payment_remarks: string;
}
