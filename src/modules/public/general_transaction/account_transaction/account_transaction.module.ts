import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTransactionService } from './account_transaction.service';
import { AccountTransactionController } from './account_transaction.controller';
import { AccountTransaction } from './entities/account_transaction.entity';
import { AccountTransactionDetail } from '../account_transaction_details/entities/account_transaction_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTransaction, AccountTransactionDetail]), // import entities
  ],
  controllers: [AccountTransactionController],
  providers: [AccountTransactionService],
})
export class AccountTransactionModule {}
