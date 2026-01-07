import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { PurchaseInvoiceController } from './purchase-invoice.controller';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { DispatchModule } from 'src/modules/public/dispatch/dispatch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseInvoice,
      AccountTransaction,
      AccountTransactionDetail,
            AccountType,  // ✅ Add AccountType here

    ]),
        DispatchModule, // ✅ import module here, NOT in forFeature

  ],
  controllers: [PurchaseInvoiceController],
  providers: [PurchaseInvoiceService],
})
export class PurchaseInvoiceModule {}
