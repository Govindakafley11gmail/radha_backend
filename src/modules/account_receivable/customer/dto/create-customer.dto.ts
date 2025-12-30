// create-customer.dto.ts
import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  identification_no?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone_no?: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

  @IsOptional()
  @IsNumber()
  credit_limit?: number;

  @IsOptional()
  @IsString()
  credit_terms?: string;
}
