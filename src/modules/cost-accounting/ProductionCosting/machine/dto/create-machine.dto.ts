import { IsNotEmpty, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { DepreciationMethod } from '../entities/machine.entity';

export class CreateMachineDto {
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  purchaseCost: number;

  @IsEnum(DepreciationMethod)
  depreciationMethod: DepreciationMethod;

  @IsNumber()
  @IsPositive()
  usefulLife: number; // in years
}
