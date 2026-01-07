import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveEncashment } from './entities/leave-encashment.entity';
import { LeaveEncashmentService } from './leave-encashment.service';
import { LeaveEncashmentController } from './leave-encashment.controller';
import { User } from 'src/modules/authentication/users/entities/user.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { LeaveType } from '../leave-types/entities/leave-type.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      LeaveEncashment,
      User,
      LeaveType,
      AccountTransaction,
      AccountTransactionDetail,
      AccountType,
    ]),
  ],
  controllers: [LeaveEncashmentController],
  providers: [LeaveEncashmentService],
})
export class LeaveEncashmentModule {}
