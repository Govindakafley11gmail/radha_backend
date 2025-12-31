import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { RawMaterialReceiptService } from './raw-material-receipt.service';
import { CreateRawMaterialReceiptDto } from './dto/create-raw-material-receipt.dto';
import { UpdateRawMaterialReceiptDto } from './dto/update-raw-material-receipt.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('raw-material-receipt')
export class RawMaterialReceiptController {
  constructor(private readonly rawMaterialReceiptService: RawMaterialReceiptService) {}

  @Post()
  async create(@Body() createRawMaterialReceiptDto: CreateRawMaterialReceiptDto) {
    try {
      const receipt = await this.rawMaterialReceiptService.createAndPostReceipt(createRawMaterialReceiptDto);
      return responseService.success(receipt, 'Raw material receipt created successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create raw material receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const receipts = await this.rawMaterialReceiptService.findAll();
      return responseService.success(receipts, 'Raw material receipts fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch raw material receipts',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const receipt = await this.rawMaterialReceiptService.findOne(id);
      return responseService.success(receipt, 'Raw material receipt fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch raw material receipt',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRawMaterialReceiptDto: UpdateRawMaterialReceiptDto) {
    try {
      const updatedReceipt = await this.rawMaterialReceiptService.update(id, updateRawMaterialReceiptDto);
      return responseService.success(updatedReceipt, 'Raw material receipt updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update raw material receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.rawMaterialReceiptService.remove(id);
      return responseService.success(null, 'Raw material receipt removed successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to remove raw material receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id/generate')
  async generateReceipt(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.rawMaterialReceiptService.generateReceipt(id, res);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
