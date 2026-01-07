import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollDto } from './create-payroll.dto';

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {
  basicSalary: number;
  allowances?: number;
  deductions?: number;
}
