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
  HttpStatus,
  Req,
} from '@nestjs/common';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('purchase-invoice')
export class PurchaseInvoiceController {
  constructor(private readonly purchaseInvoiceService: PurchaseInvoiceService) { }

  // ----------------------
  // CREATE PURCHASE INVOICE
  // ----------------------
  @Post()
  async create(@Body() createPurchaseInvoiceDto: CreatePurchaseInvoiceDto, @Req() req) {
    try {
      const userId = req.user.id; // <-- user ID from JWT payload

      const invoice = await this.purchaseInvoiceService.createAndPostInvoice(createPurchaseInvoiceDto, userId);
      return responseService.success(invoice, 'Purchase invoice created successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create purchase invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // UPDATE PURCHASE INVOICE
  // ----------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
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

      const updatedInvoice = await this.purchaseInvoiceService.update(id, updateDto);
      return responseService.success(updatedInvoice, 'Purchase invoice updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update purchase invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
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
  ) {
    try {
      const invoices = await this.purchaseInvoiceService.findAll({ invoiceNo, supplierName, fromDate, toDate, status });
      return responseService.success(invoices, 'Purchase invoices fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch purchase invoices',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // GET ONE PURCHASE INVOICE
  // ----------------------
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const invoice = await this.purchaseInvoiceService.findOne(id);
      return responseService.success(invoice, 'Purchase invoice fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch purchase invoice',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // ----------------------
  // DELETE PURCHASE INVOICE
  // ----------------------
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.purchaseInvoiceService.remove(id);
      return responseService.success(null, 'Purchase invoice removed successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to remove purchase invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
