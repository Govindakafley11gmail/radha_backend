import { IsUUID, IsNotEmpty, IsString, IsOptional, IsDateString, IsInt, Min } from 'class-validator';
import { LeaveStatus } from '../entities/leave-application.entity';

export class CreateLeaveApplicationDto {

  @IsUUID()
  @IsNotEmpty()
  leaveTypeId: string; // The type of leave (Annual, Sick, etc.)

  @IsDateString()
  @IsNotEmpty()
  start_date: string; // Leave start date

  @IsDateString()
  @IsNotEmpty()
  end_date: string; // Leave end date

  @IsInt()
  @Min(1)
  total_days: number; // Total leave days

  @IsString()
  @IsOptional()
  reason?: string; // Optional reason for leave

  @IsString()
  @IsOptional()
  status: LeaveStatus;
}
