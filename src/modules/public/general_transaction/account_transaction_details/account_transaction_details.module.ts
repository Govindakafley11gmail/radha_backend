import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTransactionDetailsService } from './account_transaction_details.service';
import { AccountTransactionDetailsController } from './account_transaction_details.controller';
import { AccountTransactionDetail } from './entities/account_transaction_detail.entity';
import { AccountGroup } from 'src/modules/master/account_group/entities/account_group.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTransactionDetail,   AccountGroup,
      AccountType,]), // <-- import repository here
  ],
  controllers: [AccountTransactionDetailsController],
  providers: [AccountTransactionDetailsService],
})
export class AccountTransactionDetailsModule {}
