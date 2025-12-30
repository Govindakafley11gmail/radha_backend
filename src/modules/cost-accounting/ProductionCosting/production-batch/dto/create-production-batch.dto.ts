// src/production-batch/dto/create-production-batch.dto.ts
import { IsString, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductionBatchDto {
  @IsString()
  batchNumber: string;

  @IsDate()
  @Type(() => Date)
  productionDate: Date;

  @IsString()
  productType: string;

  @IsNumber()
  quantityProduced: number;
}