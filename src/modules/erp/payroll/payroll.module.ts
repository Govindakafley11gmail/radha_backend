// payroll.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { Payroll } from './entities/payroll.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { PayrollDetailsModule } from '../payroll-details/payroll-details.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payroll,      AccountType, // ✅ Add this
]),PayrollDetailsModule],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
