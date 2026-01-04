import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterialInventoryService } from './raw-material-inventory.service';
import { RawMaterialInventoryController } from './raw-material-inventory.controller';
import { RawMaterialInventory } from './entities/raw-material-inventory.entity';
import { RawMaterialReceipt } from 'src/modules/cost-accounting/raw-meterials/raw-material-receipt/entities/raw-material-receipt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawMaterialInventory,RawMaterialReceipt])],
  controllers: [RawMaterialInventoryController],
  providers: [RawMaterialInventoryService],
})
export class RawMaterialInventoryModule {}
