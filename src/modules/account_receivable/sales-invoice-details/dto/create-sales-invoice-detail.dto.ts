import {
  IsUUID,
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateSalesInvoiceDetailDto {
  @IsUUID()
  salesInvoiceId: string;

  @IsUUID()
  productId: string;

  @IsString()
  @MaxLength(100)
  productType: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  size?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
