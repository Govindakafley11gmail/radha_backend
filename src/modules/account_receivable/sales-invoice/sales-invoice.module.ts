import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesInvoiceService } from './sales-invoice.service';
import { SalesInvoiceController } from './sales-invoice.controller';
import { SalesInvoice } from './entities/sales-invoice.entity';
import { SalesInvoiceDetail } from '../sales-invoice-details/entities/sales-invoice-detail.entity';
import { TaxInvoice } from 'src/modules/taxation-compliance/taxinvoice/entities/taxinvoice.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { PriceList } from 'src/modules/sales-revenue/pricelist/entities/pricelist.entity';
import { SalesReturn } from 'src/modules/sales-revenue/sales-return/entities/sales-return.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesInvoice,
      SalesInvoiceDetail,
      TaxInvoice,
      AccountTransaction,          // ✅ Add this
      AccountTransactionDetail,    // ✅ Add this
      AccountType,
      PriceList,  // ✅ Register PriceList
      // ✅ Add this
      SalesReturn,  // ✅ include this

    ]),
  ],
  controllers: [SalesInvoiceController],
  providers: [SalesInvoiceService],
})
export class SalesInvoiceModule { }
