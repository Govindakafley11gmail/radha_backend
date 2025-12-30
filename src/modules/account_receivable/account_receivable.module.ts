import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { SalesInvoiceModule } from './sales-invoice/sales-invoice.module';
import { ReceiptModule } from './receipt/receipt.module';
import { BadDebtModule } from './bad-debt/bad-debt.module';
import { SalesInvoiceDetailsModule } from './sales-invoice-details/sales-invoice-details.module';

@Module({
  imports: [CustomerModule, SalesInvoiceModule, ReceiptModule, BadDebtModule, SalesInvoiceDetailsModule]
})
export class AccountReceivableModule {}
