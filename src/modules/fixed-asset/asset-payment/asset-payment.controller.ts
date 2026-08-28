/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { AssetPaymentService } from './asset-payment.service';
import { CreateAssetPaymentDto } from './dto/create-asset-payment.dto';
import { UpdateAssetPaymentDto } from './dto/update-asset-payment.dto';
import { ResponseService } from 'src/common/response/response';
import { ReceiptPDFService } from './assertPaymentPDF';
import type { Response } from 'express';

@Controller('asset-payment')
export class AssetPaymentController {
  private readonly responseService = new ResponseService();

  constructor(private readonly assetPaymentService: AssetPaymentService,
    private readonly receiptPDFService: ReceiptPDFService,
  ) { }

  @Post()
  async create(@Body() createAssetPaymentDto: CreateAssetPaymentDto) {
    try {
      const payment = await this.assetPaymentService.create(createAssetPaymentDto);
      return this.responseService.success(
        payment,
        'Asset payment created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create asset payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const payments = await this.assetPaymentService.findAll();
      return this.responseService.success(
        payments,
        'Asset payments fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch asset payments',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.assetPaymentService.findOne(id);
      return this.responseService.success(
        payment,
        'Asset payment fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch asset payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get(':id/download')
  async downloadReceipt(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const payment = await this.assetPaymentService.findOne(id);
      console.log('Payment details for PDF generation:', payment);
      await this.receiptPDFService.generatePDF(payment, res);
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to generate asset payment receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
      // const { filePath, fileName } = await this.receiptPDFService.generatePDF(payment, res);

      // const mimeType =
      //   mime.lookup(filePath) || 'application/pdf';

      // res.setHeader(
      //   'Content-Disposition',
      //   `attachment; filename="${fileName}"`,
      // );

      // res.setHeader('Content-Type', mimeType);

      // res.setHeader(
      //   'Access-Control-Expose-Headers',
      //   'Content-Disposition',
      // );

      // return res.sendFile(fileName, {
      //   root: path.dirname(filePath),
      // });

    
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateAssetPaymentDto) {
    try {
      const payment = await this.assetPaymentService.update(id, updateDto);
      return this.responseService.success(
        payment,
        'Asset payment updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update asset payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.assetPaymentService.remove(id);
      return this.responseService.success(
        null,
        'Asset payment deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete asset payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
