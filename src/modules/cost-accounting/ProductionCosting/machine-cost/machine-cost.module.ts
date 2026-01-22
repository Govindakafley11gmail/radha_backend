import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineCostService } from './machine-cost.service';
import { MachineCostController } from './machine-cost.controller';
import { Machine } from '../machine/entities/machine.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { MachineUsageCost } from './entities/machine-cost.entity';
import { AccountpostingModule } from '../../../public/accountposting/accountposting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MachineUsageCost, Machine, ProductionBatch]),
    AccountpostingModule
  ],
  controllers: [MachineCostController],
  providers: [MachineCostService],
})
export class MachineCostModule {}
