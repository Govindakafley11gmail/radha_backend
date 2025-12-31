import { IsInt, IsPositive, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLaborCostDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  laborId: number;

  @IsUUID()
  batchId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  hoursWorked: number;
}
