import { IsUUID, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateLeaveEncashmentpaymentDto {
  @IsUUID()
  leave_encashment_id: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDateString()
  payment_date?: string;
}
