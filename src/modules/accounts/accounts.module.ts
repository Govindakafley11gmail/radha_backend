import { Module } from '@nestjs/common';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseInvoiceModule } from './purchase-invoice/purchase-invoice.module';
import { PaymentModule } from './payment/payment.module';
import { PurchaseinvoicedetailsModule } from './purchaseinvoicedetails/purchaseinvoicedetails.module';

@Module({
  imports: [SupplierModule, PurchaseInvoiceModule, PaymentModule, PurchaseinvoicedetailsModule]
})
export class AccountsModule {}
