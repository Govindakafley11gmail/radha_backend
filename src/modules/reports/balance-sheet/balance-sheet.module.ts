import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceSheetService } from './balance-sheet.service';
import { BalanceSheetController } from './balance-sheet.controller';

// ✅ Import required entities
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountGroup } from 'src/modules/master/account_group/entities/account_group.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountTransactionDetail,
      AccountTransaction,
      AccountGroup,
      AccountType,
    ]),
  ],
  controllers: [BalanceSheetController],
  providers: [BalanceSheetService],
  exports: [BalanceSheetService], // ✅ if used in other modules
})
export class BalanceSheetModule {}