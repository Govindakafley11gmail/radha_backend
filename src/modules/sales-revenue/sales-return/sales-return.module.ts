import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesReturnService } from './sales-return.service';
import { SalesReturnController } from './sales-return.controller';
import { SalesReturn } from './entities/sales-return.entity';
import { SalesInvoice } from 'src/modules/account_receivable/sales-invoice/entities/sales-invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesReturn,    // ✅ Register SalesReturn repository
      SalesInvoice,   // ✅ Register SalesInvoice repository
    ]),
  ],
  controllers: [SalesReturnController],
  providers: [SalesReturnService],
})
export class SalesReturnModule {}
