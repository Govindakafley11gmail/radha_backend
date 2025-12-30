import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterialCostService } from './raw-material-cost.service';
import { RawMaterialCostController } from './raw-material-cost.controller';
import { RawMaterialCost } from './entities/raw-material-cost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawMaterialCost])], // Register the entity
  controllers: [RawMaterialCostController],
  providers: [RawMaterialCostService],
})
export class RawMaterialCostModule {}
