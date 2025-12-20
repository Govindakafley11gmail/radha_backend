import { IsEnum, IsNumber, IsOptional, IsString, IsDateString, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMode, PaymentStatus } from '../entities/payment.entity'; // Adjust path if needed

export class PaymentDetailDto {
  @IsInt()
  @Min(1)
  invoiceId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreatePaymentDto {
  // The party/supplier/account being paid (usually a foreign key to Account or Party entity)
  @IsInt()
  @Min(1)
  paidTo: number;

  // Total payment amount
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  // Payment mode: Cash, Bank, Cheque, UPI, etc.
  @IsEnum(PaymentMode)
  paymentMode: PaymentMode;

  // Date of payment
  @IsDateString()
  paymentDate: string;

  // Optional reference/cheque/UTR number
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  // Optional notes or description
  @IsOptional()
  @IsString()
  notes?: string;

  // If paying against specific invoices (partial/full payments)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDetailDto)
  invoicePayments?: PaymentDetailDto[];

  // Optional file path for uploaded proof (cheque image, bank statement, etc.)
  // This is usually set by the controller after file upload
  @IsOptional()
  @IsString()
  paymentProof?: string;

  // Optional status (defaults to 'COMPLETED' or 'POSTED' in service)
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}