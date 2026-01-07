// src/production-batch/dto/create-production-batch.dto.ts

import { IsString, IsDate, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RawMaterialCostItem {
  @IsString()
  rawMaterialId: string;

  @IsNumber()
  usedQuantity: number;
}

export class CreateProductionBatchDto {

  @IsDate()
  @Type(() => Date)
  productionDate: Date;

  @IsString()
  productType: string;

  @IsNumber()
  quantityProduced: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RawMaterialCostItem)
  rawMaterialCosts: RawMaterialCostItem[];
}
