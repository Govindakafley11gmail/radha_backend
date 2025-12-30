import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricelistService } from './pricelist.service';
import { PricelistController } from './pricelist.controller';
import { PriceList } from './entities/pricelist.entity';
import { SalesInvoice } from 'src/modules/account_receivable/sales-invoice/entities/sales-invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PriceList,
      SalesInvoice,
    ]),
  ],
  controllers: [PricelistController],
  providers: [PricelistService],
  exports: [PricelistService],
})
export class PricelistModule {}
