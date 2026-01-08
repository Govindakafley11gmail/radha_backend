import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryslipService } from './salaryslip.service';
import { SalaryslipController } from './salaryslip.controller';
import { SalarySlip } from './entities/salaryslip.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalarySlip]), // ✅ register entity
  ],
  controllers: [SalaryslipController],
  providers: [SalaryslipService],
  exports: [SalaryslipService], // ✅ optional: if other modules (like Payroll) need it
})
export class SalaryslipModule {}
