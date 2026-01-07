import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveEncashmentpaymentService } from './leave-encashmentpayment.service';
import { LeaveEncashmentPayment } from './entities/leave-encashmentpayment.entity';
import { LeaveEncashment } from '../leave-encashment/entities/leave-encashment.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      LeaveEncashmentPayment,   // ✅ needed
      LeaveEncashment,
      AccountTransaction,
      AccountTransactionDetail,
      User,
      AccountType,
    ]),
  ],
  providers: [LeaveEncashmentpaymentService],
  exports: [LeaveEncashmentpaymentService],
})
export class LeaveEncashmentpaymentModule {}
