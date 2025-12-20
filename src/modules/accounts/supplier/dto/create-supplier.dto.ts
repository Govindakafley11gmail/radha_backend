import { Type } from 'class-transformer';
import { IsString, IsOptional, IsEmail, IsDate, IsBoolean } from 'class-validator';

export class CreateSupplierDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    phone_no?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    gender?: string; // 'Male', 'Female', 'Other'

    @IsOptional()
    @IsString()
    nationality?: string;

    @IsOptional()
    @IsString()
    cidNo?: string; // Citizenship ID

    @IsOptional()
    @IsString()
    status?: string; // 'Active', 'Inactive'

    @IsOptional()
    @IsString()
    paymentTerms?: string;

    @IsOptional()
    @IsString()
    mouFile?: string; // file path or URL

    @IsOptional()
    @IsDate()
    @Type(() => Date) // <-- convert string to Date automatically

    mouDate?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date) // <-- convert string to Date automatically

    expireDate?: Date;

    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;
}
