import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean } from "class-validator";

export class CreatePricelistDto {
      @IsString()
  product_type: string;

  @IsString()
  size: string;

  @IsNumber()
  price: number;

  @IsDateString()
  effective_date: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsString()
  sales_invoice_id?: string; // use this to link to a SalesInvoice
}
