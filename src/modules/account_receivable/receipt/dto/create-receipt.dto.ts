import {
    IsUUID,
    IsDateString,
    IsNumber,
    IsEnum,
    IsOptional,
    Min,

} from 'class-validator';
import { PaymentMethod, ReceiptStatus } from '../entities/receipt.entity';

export class CreateReceiptDto {

    @IsUUID()
    customer_id: string;
    @IsUUID()
    sales_invoice_id: string;

    @IsDateString()
    receipt_date: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    amount_received: number;

    @IsEnum(PaymentMethod)
    payment_method: PaymentMethod;

    // optional because it defaults to DRAFT
    @IsOptional()
    @IsEnum(ReceiptStatus)
    status?: ReceiptStatus;
}
