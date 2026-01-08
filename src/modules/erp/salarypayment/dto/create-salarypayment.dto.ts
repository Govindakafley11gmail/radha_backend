import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateSalarypaymentDto {
  @IsUUID()
  @IsNotEmpty()
  payrollId: string; // Link to Payroll

  @IsUUID()
  @IsNotEmpty()
  salarySlipId: string; // Link to SalarySlip

  @IsUUID()
  @IsNotEmpty()
  employeeId: number; // Link to Employee (User)

  @IsNumber()
  @IsNotEmpty()
  amount: number; // Payment amount

  @IsDateString()
  @IsNotEmpty()
  paymentDate: string; // Payment date

  @IsOptional()
  @IsString()
  paymentMode?: string; // e.g., BANK_TRANSFER, CASH, CHEQUE

  @IsOptional()
  @IsString()
  referenceNo?: string; // Transaction ID, cheque no, etc.
}
