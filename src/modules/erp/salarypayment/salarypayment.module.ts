import { Module } from '@nestjs/common';
import { SalarypaymentService } from './salarypayment.service';
import { SalarypaymentController } from './salarypayment.controller';

@Module({
  controllers: [SalarypaymentController],
  providers: [SalarypaymentService],
})
export class SalarypaymentModule {}
