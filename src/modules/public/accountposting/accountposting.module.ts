import { Module } from '@nestjs/common';
import { AccountpostingService } from './accountposting.service';
import { AccountpostingController } from './accountposting.controller';

@Module({
  controllers: [AccountpostingController],
  providers: [AccountpostingService],
})
export class AccountpostingModule {}
