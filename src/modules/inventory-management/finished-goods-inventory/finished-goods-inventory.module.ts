import { Module } from '@nestjs/common';
import { FinishedGoodsInventoryService } from './finished-goods-inventory.service';
import { FinishedGoodsInventoryController } from './finished-goods-inventory.controller';

@Module({
  controllers: [FinishedGoodsInventoryController],
  providers: [FinishedGoodsInventoryService],
})
export class FinishedGoodsInventoryModule {}
