import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalarypaymentService } from './salarypayment.service';
import { SalarypaymentController } from './salarypayment.controller';
import { SalaryPayment } from './entities/salarypayment.entity';
import { Payroll } from '../payroll/entities/payroll.entity';
import { SalarySlip } from '../salaryslip/entities/salaryslip.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalaryPayment, Payroll, SalarySlip, User]), // ✅ important!
  ],
  controllers: [SalarypaymentController],
  providers: [SalarypaymentService],
})
export class SalarypaymentModule {}
