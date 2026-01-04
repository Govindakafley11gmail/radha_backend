import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValuationMethod } from '../entities/raw-material-inventory.entity';

export class CreateRawMaterialInventoryDto {
  @IsUUID()
  raw_material_id: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity_on_hand?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value?: number;

  @IsOptional()
  @IsEnum(ValuationMethod)
  valuation_method?: ValuationMethod;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  reorder_level?: number;
}
