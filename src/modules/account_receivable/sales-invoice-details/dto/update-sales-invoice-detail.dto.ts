import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesInvoiceDetailDto } from './create-sales-invoice-detail.dto';

export class UpdateSalesInvoiceDetailDto extends PartialType(CreateSalesInvoiceDetailDto) {}
