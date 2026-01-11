import { IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";

export class CreatePricelistDto {
      @IsString()
  product_type: string;

  @IsString()
  size: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsString()
  sales_invoice_id?: string; // use this to link to a SalesInvoice
}
