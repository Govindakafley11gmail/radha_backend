import { Module } from '@nestjs/common';
import { ProductUnitCostService } from './product-unit-cost.service';
import { ProductUnitCostController } from './product-unit-cost.controller';

@Module({
  controllers: [ProductUnitCostController],
  providers: [ProductUnitCostService],
})
export class ProductUnitCostModule {}
