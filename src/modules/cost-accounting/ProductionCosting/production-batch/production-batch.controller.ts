/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/production-batch/production-batch.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ProductionBatchService } from './production-batch.service';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('production-batch')
export class ProductionBatchController {
  constructor(
    private readonly productionBatchService: ProductionBatchService,
  ) {}

  // ----------------------
  // CREATE PRODUCTION BATCH
  // ----------------------
  @Post()
  async create(@Body() createProductionBatchDto: CreateProductionBatchDto, @Req() req) {
    try {
      const userId = req.user.id; // <-- user ID from JWT payload

      const batch = await this.productionBatchService.create(
        createProductionBatchDto,
        userId,
      );

      return responseService.success(
        batch,
        'Production batch created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create production batch',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // GET ALL PRODUCTION BATCHES
  // ----------------------
  @Get()
  async findAll() {
    try {
      const batches = await this.productionBatchService.findAll();
      return responseService.success(
        batches,
        'Production batches fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch production batches',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // GET SINGLE PRODUCTION BATCH
  // ----------------------
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const batch = await this.productionBatchService.findOne(id);
      return responseService.success(
        batch,
        'Production batch fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch production batch',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // UPDATE PRODUCTION BATCH
  // ----------------------
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductionBatchDto: UpdateProductionBatchDto,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;

      const batch = await this.productionBatchService.update(
        id,
        updateProductionBatchDto,
        userId,
      );

      return responseService.success(
        batch,
        'Production batch updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update production batch',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // DELETE PRODUCTION BATCH
  // ----------------------
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.productionBatchService.remove(id);
      return responseService.success(
        null,
        'Production batch deleted successfully',
        HttpStatus.NO_CONTENT,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete production batch',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
