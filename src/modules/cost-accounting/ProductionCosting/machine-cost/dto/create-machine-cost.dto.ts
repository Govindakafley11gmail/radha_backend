import { IsPositive, IsNumber, IsUUID, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMachineCostDto {
  @IsString()
  machineId: string;  // UUID of the machine

  @IsUUID()
  batchId: string;    // UUID of the production batch

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  hoursUsed: number;

  // Optional snapshot cost fields
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  operatingCost?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  maintenanceCost?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  depreciation?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  powerCost?: number;
}
