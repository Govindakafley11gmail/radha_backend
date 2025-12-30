import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './entities/customer.entity';
import { SalesInvoice } from '../sales-invoice/entities/sales-invoice.entity';
import { Receipt } from '../receipt/entities/receipt.entity';
import { BadDebt } from '../bad-debt/entities/bad-debt.entity';
import { SalesInvoiceDetail } from '../sales-invoice-details/entities/sales-invoice-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, SalesInvoice, Receipt, BadDebt, SalesInvoiceDetail,
  ])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule { }
