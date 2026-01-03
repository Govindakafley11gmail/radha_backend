import { IsUUID, IsEnum, IsNumber, IsPositive, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { OverheadType } from '../entities/other-production-cost.entity';

export class CreateOtherProductionCostDto {
  @IsUUID()
  batchId: string; // UUID of the production batch

  @IsEnum(OverheadType)
  costType: OverheadType; // Type of overhead (RENT, UTILITIES, etc.)

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  amount: number; // Cost amount

  @IsDate()
  @Type(() => Date)
  transactionDate: Date; // Date of the cost
}
