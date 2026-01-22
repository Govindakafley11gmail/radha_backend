import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtherProductionCostService } from './other-production-cost.service';
import { OtherProductionCostController } from './other-production-cost.controller';
import { OtherProductionCost } from './entities/other-production-cost.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { AccountpostingModule } from 'src/modules/public/accountposting/accountposting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OtherProductionCost,
      ProductionBatch, // Needed for ManyToOne relation
    ]),
        AccountpostingModule, // ✅ THIS FIXES YOUR ERROR

  ],
  controllers: [OtherProductionCostController],
  providers: [OtherProductionCostService],
  exports: [OtherProductionCostService],
})
export class OtherProductionCostModule {}
