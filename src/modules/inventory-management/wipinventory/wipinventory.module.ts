import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WIPInventory } from './entities/wipinventory.entity';
import { WipinventoryService } from './wipinventory.service';
import { WipinventoryController } from './wipinventory.controller';
import { ProductionBatch } from 'src/modules/cost-accounting/ProductionCosting/production-batch/entities/production-batch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WIPInventory, ProductionBatch]),
  ],
  controllers: [WipinventoryController],
  providers: [WipinventoryService],
})
export class WipinventoryModule {}
