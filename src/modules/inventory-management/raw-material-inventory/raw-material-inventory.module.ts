import { Module } from '@nestjs/common';
import { RawMaterialInventoryService } from './raw-material-inventory.service';
import { RawMaterialInventoryController } from './raw-material-inventory.controller';

@Module({
  controllers: [RawMaterialInventoryController],
  providers: [RawMaterialInventoryService],
})
export class RawMaterialInventoryModule {}
