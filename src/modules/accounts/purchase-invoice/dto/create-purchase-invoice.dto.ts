import {
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseInvoiceDetailDto {
  @IsString()
  productId: string;

  @IsString()
  productType: string;

  @IsString()
  productCode: string;

  @IsOptional()
  @IsString()
  size?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  total?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  taxAmount?: number;


  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  freightCost?: number;

}

export class PurchaseInvoiceReportDto {
  @IsOptional()
  @IsString()
  invoiceNo?: string;
  @IsOptional()
  @IsString()
  supplierName?: string
  @IsOptional()
  @IsString()
  fromDate?: string
  @IsOptional()
  @IsString()
  toDate?: string
  @IsOptional()
  @IsString()
  status?: string
}
export class CreatePurchaseInvoiceDto {
  @IsString()
  invoiceNo: string;

  @IsString()
  supplierId: string;

  @IsDate()
  @Type(() => Date)
  invoiceDate: Date;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  freightCost?: number;

  @IsString()
  materialTypes

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  importDuty?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  scrapQuantity?: number;

  @Type(() => Number)
  @IsNumber()
  totalAmount: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  GStTaxAmount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseInvoiceDetailDto)
  details?: CreatePurchaseInvoiceDetailDto[];
}
