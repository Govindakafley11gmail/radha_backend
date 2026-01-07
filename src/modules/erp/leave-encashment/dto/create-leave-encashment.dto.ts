import { Optional } from '@nestjs/common';
import { IsUUID, IsInt, Min, IsNumber, IsString } from 'class-validator';

export class CreateLeaveEncashmentDto {
  @IsUUID()
  leaveTypeId: string; // The leave type being encashed

  @IsInt()
  @Min(1)
  days: number; // Number of leave days to encash

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number; // Total encashment amount

  @IsString()
  @Optional()
  status: string;
}
