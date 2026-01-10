/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { ResponseService } from 'src/common/response/response';
import type { Response } from 'express';

const responseService = new ResponseService();

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  async create(@Body() createReceiptDto: CreateReceiptDto, @Req() req) {
    try {
      const userId = req.user.id; // <-- user ID from JWT payload

      const receipt = await this.receiptService.create(
        createReceiptDto,
        userId,
      );

      return responseService.success(
        receipt,
        'Receipt created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const receipts = await this.receiptService.findAll();
      return responseService.success(
        receipts,
        'Receipts fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch receipts',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const receipt = await this.receiptService.findOne(id);
      return responseService.success(
        receipt,
        'Receipt fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Receipt not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReceiptDto: UpdateReceiptDto,
  ) {
    try {
      const receipt = await this.receiptService.update(
        id,
        updateReceiptDto,
      );

      return responseService.success(
        receipt,
        'Receipt updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    try {
      const receipt = await this.receiptService.cancelReceipt(id);
      return responseService.success(
        receipt,
        'Receipt cancelled successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to cancel receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * NOTE:
   * This endpoint streams/downloads a file,
   * so we DO NOT wrap it with ResponseService
   */
  @Get(':id/generate')
  async generateReceipt(@Param('id') id: string, @Res() res: Response) {
    return this.receiptService.generateReceipt(id, res);
  }
}
