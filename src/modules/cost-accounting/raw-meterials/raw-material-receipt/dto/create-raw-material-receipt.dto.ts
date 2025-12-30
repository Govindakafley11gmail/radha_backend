import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateRawMaterialReceiptDto {
  @IsNotEmpty()
  @IsString()
  raw_material_id: string;

  @IsNotEmpty()
  @IsString()
  supplier_id: string;

  @IsNumber()
  @IsOptional()
  gst_tax_amount?: number;

  @IsNotEmpty()
  @IsString()
  purchase_invoice_id: string;

  @IsNotEmpty()
  @IsNumber()
  quantity_received: number;

  @IsNotEmpty()
  @IsNumber()
  total_unit_cost: number;

  @IsOptional()
  @IsNumber()
  freight_cost?: number;

  @IsOptional()
  @IsNumber()
  import_duty?: number;

  @IsOptional()
  @IsNumber()
  scrap_quantity?: number;

  @IsNotEmpty()
  @IsNumber()
  total_cost: number; // Can be calculated as quantity_received*unit_cost + freight_cost + import_duty - scrap_value

  @IsOptional()
  @IsDateString()
  received_date?: string; // Optional, defaults to today if not provided
}
