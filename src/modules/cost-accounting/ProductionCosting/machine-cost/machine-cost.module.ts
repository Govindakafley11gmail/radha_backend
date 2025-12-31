import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineCostService } from './machine-cost.service';
import { MachineCostController } from './machine-cost.controller';
import { Machine } from '../machine/entities/machine.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { MachineUsageCost } from './entities/machine-cost.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MachineUsageCost, Machine, ProductionBatch]),
  ],
  controllers: [MachineCostController],
  providers: [MachineCostService],
})
export class MachineCostModule {}
