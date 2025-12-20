import { Module } from '@nestjs/common';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseInvoiceModule } from './purchase-invoice/purchase-invoice.module';
import { PaymentModule } from './payment/payment.module';
import { ApAgingModule } from './ap_aging/ap_aging.module';

@Module({
  imports: [SupplierModule, PurchaseInvoiceModule, PaymentModule, ApAgingModule]
})
export class AccountsModule {}
