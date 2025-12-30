import { Module } from '@nestjs/common';
import { MachineCostService } from './machine-cost.service';
import { MachineCostController } from './machine-cost.controller';

@Module({
  controllers: [MachineCostController],
  providers: [MachineCostService],
})
export class MachineCostModule {}
