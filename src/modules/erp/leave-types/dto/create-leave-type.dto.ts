import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g., "Annual Leave", "Sick Leave"

  @IsString()
  @IsOptional()
  description?: string; // Optional description of the leave type

  @IsInt()
  @Min(0)
  max_days: number; // Maximum leave days allowed per year

  @IsBoolean()
  @IsOptional()
  is_paid?: boolean = false; // Whether this leave is paid; default is false
}
