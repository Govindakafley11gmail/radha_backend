import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveEncashmentpaymentDto } from './create-leave-encashmentpayment.dto';

export class UpdateLeaveEncashmentpaymentDto extends PartialType(CreateLeaveEncashmentpaymentDto) {}
