// import {
//   IsString,
//   IsDate,
//   IsOptional,
//   IsNumber,
//   IsArray,
//   ValidateNested,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { CreatePurchaseInvoiceDetailDto } from '../../purchase-invoice/dto/create-purchase-invoice.dto';

// export class CreatePurchaseInvoiceDto {
//   @IsString()
//   invoiceNo: string;

//   @IsString()
//   supplierId: string;

//   @IsDate()
//   @Type(() => Date)
//   invoiceDate: Date;

//   @Type(() => Number)
//   @IsNumber()
//   totalAmount: number;

//   @Type(() => Number)
//   @IsNumber()
//   taxAmount: number;

//   @IsString()
//   @IsOptional()
//   description?: string;

//   @IsString()
//   @IsOptional()
//   status?: string;

//   @IsString()
//   @IsOptional()
//   accountGroupId?: string;

//   @IsString()
//   @IsOptional()
//   accountTypeId?: string;

//   // ✅ This allows sending an array of purchase invoice details
//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   @Type(() => CreatePurchaseInvoiceDetailDto)
//   details?: CreatePurchaseInvoiceDetailDto[];
// }
