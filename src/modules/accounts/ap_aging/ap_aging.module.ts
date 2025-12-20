import { Module } from '@nestjs/common';
import { ApAgingService } from './ap_aging.service';
import { ApAgingController } from './ap_aging.controller';

@Module({
  controllers: [ApAgingController],
  providers: [ApAgingService],
})
export class ApAgingModule {}
