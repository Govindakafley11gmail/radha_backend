import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollDetail } from './entities/payroll-detail.entity'; // import your entity

@Module({
  imports: [TypeOrmModule.forFeature([PayrollDetail])], // <-- THIS
  exports: [TypeOrmModule], // export if other modules need repository
})
export class PayrollDetailsModule {}
