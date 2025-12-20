import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';

@Controller('purchase-invoice')
export class PurchaseInvoiceController {
  constructor(private readonly purchaseInvoiceService: PurchaseInvoiceService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('invoiceFile', {
      storage: diskStorage({
        destination: './uploads/invoices', // specific folder
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Optional: restrict file types
        if (!file.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
          return callback(new Error('Only PDF and image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createPurchaseInvoiceDto: CreatePurchaseInvoiceDto,
    @UploadedFile() invoiceFile?: Express.Multer.File,
  ): Promise<any> {
    const invoiceFilePath = invoiceFile ? invoiceFile.path : undefined;
    return await this.purchaseInvoiceService.create(createPurchaseInvoiceDto, invoiceFilePath);
  }

@Get()
async findAll(
  @Query('invoiceNo') invoiceNo?: string,
  @Query('supplierName') supplierName?: string,
  @Query('fromDate') fromDate?: string,
  @Query('toDate') toDate?: string,
  @Query('status') status?: string, // new status query
): Promise<PurchaseInvoice[]> {
  return await this.purchaseInvoiceService.findAll({ invoiceNo, supplierName, fromDate, toDate, status });
}


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PurchaseInvoice> {
    return await this.purchaseInvoiceService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('invoiceFile', {
      storage: diskStorage({
        destination: './uploads/invoices',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
          return callback(new Error('Only PDF and image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePurchaseInvoiceDto: UpdatePurchaseInvoiceDto,
    @UploadedFile() invoiceFile?: Express.Multer.File,
  ): Promise<PurchaseInvoice> {
    const invoiceFilePath = invoiceFile ? invoiceFile.path : undefined;
    return await this.purchaseInvoiceService.update(id, updatePurchaseInvoiceDto, invoiceFilePath);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.purchaseInvoiceService.remove(id);
  }
}
