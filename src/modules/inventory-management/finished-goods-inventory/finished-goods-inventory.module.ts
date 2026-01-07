import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinishedGoodsInventoryService } from './finished-goods-inventory.service';
import { FinishedGoodsInventoryController } from './finished-goods-inventory.controller';
import { FinishedGoodsInventory } from './entities/finished-goods-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinishedGoodsInventory])], // ✅ Register entity
  controllers: [FinishedGoodsInventoryController],
  providers: [FinishedGoodsInventoryService],
})
export class FinishedGoodsInventoryModule {}
