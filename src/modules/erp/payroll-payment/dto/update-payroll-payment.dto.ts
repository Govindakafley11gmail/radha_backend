import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollPaymentDto } from './create-payroll-payment.dto';

export class UpdatePayrollPaymentDto extends PartialType(CreatePayrollPaymentDto) {}
