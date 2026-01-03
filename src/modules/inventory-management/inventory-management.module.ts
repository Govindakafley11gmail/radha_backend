import { Module } from '@nestjs/common';
import { RawMaterialInventoryModule } from './raw-material-inventory/raw-material-inventory.module';
import { WipinventoryModule } from './wipinventory/wipinventory.module';
import { FinishedGoodsInventoryModule } from './finished-goods-inventory/finished-goods-inventory.module';

@Module({
  imports: [RawMaterialInventoryModule, WipinventoryModule, FinishedGoodsInventoryModule]
})
export class InventoryManagementModule {}
