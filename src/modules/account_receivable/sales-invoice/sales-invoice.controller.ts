import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SalesInvoiceService } from './sales-invoice.service';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto';

@Controller('sales-invoice')
export class SalesInvoiceController {
  constructor(private readonly salesInvoiceService: SalesInvoiceService) {}

  // ✅ Create and post invoice with details & accounting entries
  @Post()
  async create(@Body() createSalesInvoiceDto: CreateSalesInvoiceDto) {

    return this.salesInvoiceService.createAndPostInvoice(createSalesInvoiceDto);
  }

@Get()
async findAll() {
  return this.salesInvoiceService.findAll();
}


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.salesInvoiceService.findOne(id);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.salesInvoiceService.remove(id);
  }
}
