import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptService } from './receipt.service';
import { Receipt } from './entities/receipt.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { ReceiptController } from './receipt.controller';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { ReceiptPDFService } from './receiptPDFServices';
import { Customer } from '../customer/entities/customer.entity';
import { SalesInvoice } from '../sales-invoice/entities/sales-invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Receipt,
      AccountTransaction,
      AccountTransactionDetail,
      AccountType, // <-- add this
      Customer, SalesInvoice,

    ]),
  ],
  controllers: [ReceiptController], // ✅ Add this line

  providers: [
    ReceiptService,
    ReceiptPDFService, // ✅ THIS IS WHAT WAS MISSING
  ],
  exports: [ReceiptService],
})
export class ReceiptModule { }
