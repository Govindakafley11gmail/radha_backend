import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LaborCost } from './entities/labor-cost.entity';
import { Labor } from '../labor/entities/labor.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { LaborCostService } from './labor-cost.service';
import { LaborCostController } from './labor-cost.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LaborCost,
      Labor,
      ProductionBatch,
    ]),
  ],
  controllers: [LaborCostController],
  providers: [LaborCostService],
})
export class LaborCostModule {}
