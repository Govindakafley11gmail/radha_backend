import { Controller, Get, Body, Param, Delete } from '@nestjs/common';
import { SalesInvoiceDetailsService } from './sales-invoice-details.service';

@Controller('sales-invoice-details')
export class SalesInvoiceDetailsController {
  constructor(private readonly salesInvoiceDetailsService: SalesInvoiceDetailsService) {}



  @Get()
  findAll() {
    return this.salesInvoiceDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesInvoiceDetailsService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesInvoiceDetailsService.remove(id);
  }
}
