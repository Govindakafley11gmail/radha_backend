import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUnitCostService } from './product-unit-cost.service';
import { ProductUnitCostController } from './product-unit-cost.controller';
import { ProductUnitCost } from './entities/product-unit-cost.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { AccountpostingModule } from 'src/modules/public/accountposting/accountposting.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductUnitCost, ProductionBatch]), AccountpostingModule, // <-- IMPORT the module
],
  controllers: [ProductUnitCostController],
  providers: [ProductUnitCostService],
})
export class ProductUnitCostModule {}
