import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxInvoiceDto } from './create-taxinvoice.dto';

export class UpdateTaxinvoiceDto extends PartialType(CreateTaxInvoiceDto) {
  customerId: string;
  invoiceNumber: string;
  invoiceDate: any;
  totalAmount: undefined;
  taxAmount: undefined;
}
