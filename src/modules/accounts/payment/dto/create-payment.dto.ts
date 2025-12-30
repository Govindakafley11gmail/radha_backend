import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { PaymentMode, PaymentStatus } from '../entities/payment.entity';

// DTO for creating a payment
export class CreatePaymentDto {
  @IsString()
  id: string;
  // The invoice being paid
  @IsString()
  invoiceId: string;

  // Total payment amount
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  
  // Payment mode: Cash, Bank, Cheque, Online, etc.
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
  description?: string;

  // Optional status (defaults to COMPLETED in service)
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
