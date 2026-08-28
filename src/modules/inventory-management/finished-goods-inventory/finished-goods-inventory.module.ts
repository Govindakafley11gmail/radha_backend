import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinishedGoodsInventoryService } from './finished-goods-inventory.service';
import { FinishedGoodsInventoryController } from './finished-goods-inventory.controller';
import { FinishedGoodsInventory } from './entities/finished-goods-inventory.entity';
import { ProductUnitCost } from 'src/modules/cost-accounting/ProductionCosting/product-unit-cost/entities/product-unit-cost.entity';
import { ProductionBatch } from 'src/modules/cost-accounting/ProductionCosting/production-batch/entities/production-batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinishedGoodsInventory,     ProductUnitCost,     // ✅ add this
      ProductionBatch,       ])], // ✅ Register entity

  controllers: [FinishedGoodsInventoryController],
  providers: [FinishedGoodsInventoryService],
})
export class FinishedGoodsInventoryModule {}
