import { Module } from '@nestjs/common';
import { WipinventoryService } from './wipinventory.service';
import { WipinventoryController } from './wipinventory.controller';

@Module({
  controllers: [WipinventoryController],
  providers: [WipinventoryService],
})
export class WipinventoryModule {}
