import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaborService } from './labor.service';
import { LaborController } from './labor.controller';
import { Labor } from './entities/labor.entity';
import { LaborCost } from '../labor-cost/entities/labor-cost.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Labor, LaborCost]), // 🔑 Register entities
  ],
  controllers: [LaborController],
  providers: [LaborService],
})
export class LaborModule {}