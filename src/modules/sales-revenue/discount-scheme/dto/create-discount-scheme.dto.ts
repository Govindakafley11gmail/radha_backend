import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { DiscountType } from '../entities/discount-scheme.entity';

export class CreateDiscountSchemeDto {
  @IsString()
  product_type: string; // Matches entity

  @IsEnum(DiscountType)
  discount_type: DiscountType; // Must be 'PERCENTAGE' or 'FIXED'

  @IsNumber()
  value: number; // Numeric value for discount

  @IsDateString()
  valid_from: string; // Start date (ISO string)

  @IsDateString()
  valid_to: string; // End date (ISO string)

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean; // Optional soft delete flag
}
