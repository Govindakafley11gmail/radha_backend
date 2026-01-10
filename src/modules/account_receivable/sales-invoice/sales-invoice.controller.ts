/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { SalesInvoiceService } from './sales-invoice.service';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('sales-invoice')
export class SalesInvoiceController {
  constructor(
    private readonly salesInvoiceService: SalesInvoiceService,
  ) {}

  // ✅ Create and post invoice with details & accounting entries
  @Post()
  async create(
    @Body() createSalesInvoiceDto: CreateSalesInvoiceDto,
    @Req() req,
  ) {
    try {
      const userId = req.user.id; // <-- user ID from JWT payload

      const invoice =
        await this.salesInvoiceService.createAndPostInvoice(
          createSalesInvoiceDto,
          userId,
        );

      return responseService.success(
        invoice,
        'Sales invoice created and posted successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create sales invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const invoices = await this.salesInvoiceService.findAll();
      return responseService.success(
        invoices,
        'Sales invoices fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch sales invoices',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const invoice = await this.salesInvoiceService.findOne(id);
      return responseService.success(
        invoice,
        'Sales invoice fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Sales invoice not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.salesInvoiceService.remove(id);
      return responseService.success(
        null,
        'Sales invoice deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete sales invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
