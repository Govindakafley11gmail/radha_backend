import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfitLossAccountService } from './profit-loss-account.service';
import { ProfitLossAccountController } from './profit-loss-account.controller';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTransactionDetail]),
  ],
  controllers: [ProfitLossAccountController],
  providers: [ProfitLossAccountService],
})
export class ProfitLossAccountModule {}