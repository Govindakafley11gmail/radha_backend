import {
  IsString,
  IsEnum,
  IsNumber,
  IsPositive,
  Matches,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LaborType, Gender } from '../entities/labor.entity';

export class CreateLaborDto {
  @IsString()
  name: string;

  @IsString()
  identificationNo: string;

  @IsString()
  @Matches(/^[0-9]{8,15}$/, { message: 'Mobile number must be 8-15 digits' })
  mobileNo: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsNumber()
  @Min(18, { message: 'Age must be at least 18' })
  @Max(100, { message: 'Age must be below 100' })
  @Type(() => Number)
  age: number;

  @IsString()
  dzongkhag: string; // Dzongkhag / Location

  @IsEnum(LaborType)
  type: LaborType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  hourlyRate: number;
}
