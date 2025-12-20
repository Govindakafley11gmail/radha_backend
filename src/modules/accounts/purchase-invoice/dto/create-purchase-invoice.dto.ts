import {
    IsString,
    IsDateString,
    IsOptional,
    IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseInvoiceDto {
    @IsString()
    invoiceNo: string;

    @IsString()
    supplier_id: string;

    @IsDateString()
    invoiceDate: string;

    @Type(() => Number)
    @IsNumber()
    totalAmount: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    taxAmount?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    accountGroupId: string;

    @IsString()
    @IsOptional()
    accountTypeId: string;
}
