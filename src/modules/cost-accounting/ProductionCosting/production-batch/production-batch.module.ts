// src/production-batch/production-batch.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionBatchService } from './production-batch.service';
import { ProductionBatchController } from './production-batch.controller';
import { ProductionBatch } from './entities/production-batch.entity';
import { RawMaterialCost } from '../../raw-meterials/raw-material-cost/entities/raw-material-cost.entity';
import { RawMaterial } from '../../raw-meterials/raw-material/entities/raw-material.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionBatch, RawMaterialCost, RawMaterial]),
  ],
  controllers: [ProductionBatchController],
  providers: [ProductionBatchService],
})
export class ProductionBatchModule {}
