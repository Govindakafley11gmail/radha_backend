import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountpostingService } from './accountposting.service';
import { AccountpostingController } from './accountposting.controller';
import { AccountTransaction } from '../general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from '../general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountTransaction,
      AccountTransactionDetail,
      AccountType, // ✅ Add this line
    ]),
  ],
  controllers: [AccountpostingController],
  providers: [AccountpostingService],
  exports: [AccountpostingService], // if used in other modules
})
export class AccountpostingModule {}
