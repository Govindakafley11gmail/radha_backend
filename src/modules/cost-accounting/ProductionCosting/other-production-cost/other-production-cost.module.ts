import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtherProductionCostService } from './other-production-cost.service';
import { OtherProductionCostController } from './other-production-cost.controller';
import { OtherProductionCost } from './entities/other-production-cost.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OtherProductionCost,
      ProductionBatch, // Needed for ManyToOne relation
    ]),
  ],
  controllers: [OtherProductionCostController],
  providers: [OtherProductionCostService],
  exports: [OtherProductionCostService],
})
export class OtherProductionCostModule {}
