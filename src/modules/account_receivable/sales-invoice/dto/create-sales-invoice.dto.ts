/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IsString, IsNumber, IsOptional, IsDate, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSalesInvoiceDetailDto {
  @IsString()
  productId: string;

  @IsString()
  productType: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsNumber()
  taxAmount: number;
}

export class CreateSalesInvoiceDto {
  @IsString()
  customerId: string;

  @IsString()
  invoiceNumber: string;

  @IsDate()
  @Type(() => Date)
  invoiceDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  taxAmount: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesInvoiceDetailDto)
  details?: CreateSalesInvoiceDetailDto[];
}
