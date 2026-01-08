import { PartialType } from '@nestjs/mapped-types';
import { CreateSalaryslipDto } from './create-salaryslip.dto';

export class UpdateSalaryslipDto extends PartialType(CreateSalaryslipDto) {}
