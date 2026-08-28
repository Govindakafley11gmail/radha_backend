import { IsString, IsNumber, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateAssetPaymentDto {
  @IsString()
  paymentId!: string; // the asset being paid

  @IsString()
  assertId!: string; // the asset being paid
  
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid decimal number' },
  )
  @IsNotEmpty()
  amount!: number;

  @IsOptional()
  @IsDateString()
  paymentDate?: string; // optional, defaults to today

  @IsOptional()
  @IsString()
  paymentMode?: string; // Cash, Bank, Cheque, etc.

  @IsOptional()
  @IsString()
  description?: string;
 @IsOptional()
  @IsString()
  chequeNumber!: string;
}
