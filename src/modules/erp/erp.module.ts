import { Module } from '@nestjs/common';
import { LeaveTypesModule } from './leave-types/leave-types.module';
import { LeaveApplicationModule } from './leave-application/leave-application.module';
import { LeaveEncashmentModule } from './leave-encashment/leave-encashment.module';
import { LeaveEncashmentpaymentModule } from './leave-encashmentpayment/leave-encashmentpayment.module';
import { PayrollModule } from './payroll/payroll.module';
import { PayrollDetailsModule } from './payroll-details/payroll-details.module';
import { SalaryslipModule } from './salaryslip/salaryslip.module';
import { SalarypaymentModule } from './salarypayment/salarypayment.module';
import { PayrollPaymentModule } from './payroll-payment/payroll-payment.module';

@Module({
  imports: [ LeaveTypesModule, LeaveApplicationModule, LeaveEncashmentModule, LeaveEncashmentpaymentModule, PayrollModule, PayrollDetailsModule, SalaryslipModule, SalarypaymentModule, PayrollPaymentModule]
})
export class ErpModule {}
