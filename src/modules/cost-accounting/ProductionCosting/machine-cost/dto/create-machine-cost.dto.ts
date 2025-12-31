import { IsInt, IsPositive, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMachineCostDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  machineId: number;  // numeric ID

  @IsUUID()
  batchId: string;    // string UUID, must match ProductionBatch.id

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  hoursUsed: number;
}
