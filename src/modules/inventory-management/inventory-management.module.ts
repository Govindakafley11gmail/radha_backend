import { Module } from '@nestjs/common';
import { RawMaterialInventoryModule } from './raw-material-inventory/raw-material-inventory.module';
import { WipinventoryModule } from './wipinventory/wipinventory.module';
import { FinishedGoodsInventoryModule } from './finished-goods-inventory/finished-goods-inventory.module';
import { PayrollPaymentModule } from '../erp/payroll-payment/payroll-payment.module';

@Module({
  imports: [RawMaterialInventoryModule, WipinventoryModule, FinishedGoodsInventoryModule,PayrollPaymentModule]
})
export class InventoryManagementModule {}
