import { IsPositive, IsNumber, IsUUID, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMachineCostDto {
  @IsUUID()
  @IsString()
  machineId: string; // UUID of the machine

  @IsUUID()
  batchId: string; // UUID of the production batch

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  hoursUsed: number; // Hours the machine was used

  // Optional snapshot cost fields (if pre-calculated)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  operatingCost?: number; // Operating cost (can be auto-calculated)

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  maintenanceCost?: number; // Maintenance cost

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  depreciation?: number; // Depreciation

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  powerCost?: number; // Power consumption cost

  // Optional: Operating rate per hour (used for auto calculation if operatingCost not provided)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  operatingRate?: number;
}
