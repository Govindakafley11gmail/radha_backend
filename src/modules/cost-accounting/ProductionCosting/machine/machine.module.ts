import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { Machine } from './entities/machine.entity';
import { MachineUsageCost } from '../machine-cost/entities/machine-cost.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Machine,
      MachineUsageCost,
    ]),
  ],
  controllers: [MachineController],
  providers: [MachineService],
  exports: [MachineService],
})
export class MachineModule {}
