import {  IsPositive, IsNumber, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLaborCostDto {
  @IsString()
  laborId: string;

  @IsUUID()
  batchId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  hoursWorked: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  hourlyRateSnapshot: number; // Snapshot of labor rate at the time of production
}
