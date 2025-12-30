// purchaseinvoicedetails.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseinvoicedetailsService } from './purchaseinvoicedetails.service';
import { PurchaseinvoicedetailsController } from './purchaseinvoicedetails.controller';
import { PurchaseInvoiceDetail } from './entities/purchaseinvoicedetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseInvoiceDetail])],
  controllers: [PurchaseinvoicedetailsController],
  providers: [PurchaseinvoicedetailsService],
  exports: [PurchaseinvoicedetailsService],
})
export class PurchaseinvoicedetailsModule {}
