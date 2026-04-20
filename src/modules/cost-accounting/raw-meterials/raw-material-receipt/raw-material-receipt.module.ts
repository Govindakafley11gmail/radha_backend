import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RawMaterialReceiptService } from './raw-material-receipt.service';
import { RawMaterialReceiptController } from './raw-material-receipt.controller';

import { RawMaterialReceipt } from './entities/raw-material-receipt.entity';
import { RawMaterialInventory } from 'src/modules/inventory-management/raw-material-inventory/entities/raw-material-inventory.entity';

import { ReceiptPDFService } from './receiptPDFServices';

// 🔥 ADD THESE MISSING IMPORTS
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountGroup } from 'src/modules/master/account_group/entities/account_group.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';
import { Payment } from 'src/modules/accounts/payment/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RawMaterialReceipt,
      RawMaterialInventory,

      // 🔥 REQUIRED FOR YOUR SERVICE
      AccountType,
      AccountGroup,
      AccountTransaction,
      AccountTransactionDetail,
      PurchaseInvoice,
      Payment,
    ]),
  ],  

  controllers: [RawMaterialReceiptController],

  providers: [
    RawMaterialReceiptService,
    ReceiptPDFService,
  ],
})
export class RawMaterialReceiptModule {}