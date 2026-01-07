import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveEncashmentDto } from './create-leave-encashment.dto';
import { IsEnum, IsOptional } from 'class-validator';
import type { EncashmentStatus } from '../entities/leave-encashment.entity';

export class UpdateLeaveEncashmentDto extends PartialType(CreateLeaveEncashmentDto) {
  // Only HR/Manager can update status
  @IsEnum(['PENDING', 'PAID', 'REJECTED'])
  @IsOptional()
  status?: EncashmentStatus;
}
