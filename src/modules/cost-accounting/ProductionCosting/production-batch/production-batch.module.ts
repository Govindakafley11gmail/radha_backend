import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionBatchService } from './production-batch.service';
import { ProductionBatchController } from './production-batch.controller';
import { ProductionBatch } from './entities/production-batch.entity'
import { OtherProductionCost } from '../other-production-cost/entities/other-production-cost.entity';
import { LaborCost } from '../labor-cost/entities/labor-cost.entity';
import { MachineUsageCost } from '../machine-cost/entities/machine-cost.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductionBatch,
      MachineUsageCost,
      LaborCost,
      OtherProductionCost,
    ]),
  ],
  controllers: [ProductionBatchController],
  providers: [ProductionBatchService],
  exports: [ProductionBatchService],
})
export class ProductionBatchModule {}
