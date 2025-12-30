import { Module } from '@nestjs/common';
import { PricelistModule } from './pricelist/pricelist.module';
import { DiscountSchemeModule } from './discount-scheme/discount-scheme.module';
import { SalesReturnModule } from './sales-return/sales-return.module';

@Module({
  imports: [PricelistModule, DiscountSchemeModule, SalesReturnModule]
})
export class SalesRevenueModule {}
