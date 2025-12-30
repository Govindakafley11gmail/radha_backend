/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';

@Controller('purchase-invoice')
export class PurchaseInvoiceController {
  constructor(private readonly purchaseInvoiceService: PurchaseInvoiceService) {}

  // ----------------------
  // CREATE PURCHASE INVOICE
  // ----------------------
  @Post()
  async create(@Body() CreatePurchaseInvoiceDto: CreatePurchaseInvoiceDto): Promise<PurchaseInvoice> {


    return await this.purchaseInvoiceService.createAndPostInvoice(CreatePurchaseInvoiceDto);
  }

  // ----------------------
  // UPDATE PURCHASE INVOICE
  // ----------------------
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<PurchaseInvoice> {
    if (body.details && typeof body.details === 'string') {
      try {
        body.details = JSON.parse(body.details);
      } catch (error) {
        throw new BadRequestException('Invalid JSON format for details array');
      }
    }

    const updateDto: UpdatePurchaseInvoiceDto = {
      invoiceNo: body.invoiceNo,
      supplierId: body.supplierId,
      invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : undefined,
      totalAmount: body.totalAmount ? Number(body.totalAmount) : undefined,
      GStTaxAmount: body.GStTaxAmount ? Number(body.GStTaxAmount) : undefined,
      description: body.description,
      status: body.status,
      details: body.details,
    };

    return await this.purchaseInvoiceService.update(id, updateDto);
  }

  // ----------------------
  // GET ALL PURCHASE INVOICES
  // ----------------------
  @Get()
  async findAll(
    @Query('invoiceNo') invoiceNo?: string,
    @Query('supplierName') supplierName?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('status') status?: string,
  ): Promise<PurchaseInvoice[]> {
    return await this.purchaseInvoiceService.findAll({ invoiceNo, supplierName, fromDate, toDate, status });
  }

  // ----------------------
  // GET ONE PURCHASE INVOICE
  // ----------------------
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PurchaseInvoice> {
    return await this.purchaseInvoiceService.findOne(id);
  }

  // ----------------------
  // DELETE PURCHASE INVOICE
  // ----------------------
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.purchaseInvoiceService.remove(id);
  }
}
