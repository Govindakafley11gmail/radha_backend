/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { SalesInvoiceService } from './sales-invoice.service';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto';

@Controller('sales-invoice')
export class SalesInvoiceController {
  constructor(private readonly salesInvoiceService: SalesInvoiceService) {}

  // ✅ Create and post invoice with details & accounting entries
  @Post()
  async create(@Body() createSalesInvoiceDto: CreateSalesInvoiceDto, @Req() req) {
            const userId = req.user.id; // <-- user ID from JWT payload

    return this.salesInvoiceService.createAndPostInvoice(createSalesInvoiceDto, userId);
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
