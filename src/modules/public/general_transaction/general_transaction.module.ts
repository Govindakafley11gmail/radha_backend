import { Module } from '@nestjs/common';
import { AccountTransactionModule } from './account_transaction/account_transaction.module';
import { AccountTransactionDetailsModule } from './account_transaction_details/account_transaction_details.module';
import { DispatchModule } from '../dispatch/dispatch.module';

@Module({
  imports: [AccountTransactionModule, AccountTransactionDetailsModule,DispatchModule]
})
export class GeneralTransactionModule {}
