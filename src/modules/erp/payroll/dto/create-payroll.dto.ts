import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

/* ---------------- Employee Payroll DTO ---------------- */

export class PayrollEmployeeDto {
  @IsInt()
  employeeId: number;

  @IsNumber()
  @Min(0)
  basicSalary: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tds?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  medical?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  housingAllowance?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  otherAllowance?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  providentInterest?: number;
}

/* ---------------- Create Payroll DTO ---------------- */

export class CreatePayrollDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayrollEmployeeDto)
  employees: PayrollEmployeeDto[];

  @IsDateString()
  payrollDate: string;

  @IsString()
  month: string;

  @IsInt()
  year: number;

  // ⚠️ Recommended: compute these in service, not from client
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalDeduction?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalAllowance?: number;

  @IsString()
  @IsOptional()
  remarks?: string;
}
