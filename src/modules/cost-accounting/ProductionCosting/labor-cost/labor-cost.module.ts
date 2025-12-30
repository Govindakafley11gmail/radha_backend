import { Module } from '@nestjs/common';
import { LaborCostService } from './labor-cost.service';
import { LaborCostController } from './labor-cost.controller';

@Module({
  controllers: [LaborCostController],
  providers: [LaborCostService],
})
export class LaborCostModule {}
