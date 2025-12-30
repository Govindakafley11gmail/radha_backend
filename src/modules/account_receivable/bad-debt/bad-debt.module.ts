import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadDebtService } from './bad-debt.service';
import { BadDebtController } from './bad-debt.controller';
import { BadDebt } from './entities/bad-debt.entity';
import { Customer } from '../customer/entities/customer.entity';
import { SalesInvoice } from '../sales-invoice/entities/sales-invoice.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BadDebt,
      Customer,
      SalesInvoice,
      AccountTransaction,
      AccountTransactionDetail,
      AccountType,
    ]),
  ],
  controllers: [BadDebtController],
  providers: [BadDebtService],
})
export class BadDebtModule {}
