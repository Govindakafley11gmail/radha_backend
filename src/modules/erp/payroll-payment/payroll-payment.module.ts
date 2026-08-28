import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PayrollPayment } from './entities/payroll-payment.entity';
import { Payroll } from '../payroll/entities/payroll.entity';

import { PayrollPaymentService } from './payroll-payment.service';
import { PayrollPaymentController } from './payroll-payment.controller';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PayrollPayment, Payroll,AccountType])],
  controllers: [PayrollPaymentController],
  providers: [PayrollPaymentService],
})
export class PayrollPaymentModule {}