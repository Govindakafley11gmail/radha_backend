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
} from '@nestjs/common';
import { ProductionBatchService } from './production-batch.service';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';

@Controller('production-batch')
export class ProductionBatchController {
  constructor(
    private readonly productionBatchService: ProductionBatchService,
  ) {}

  @Post()
  async create(@Body() createProductionBatchDto: CreateProductionBatchDto) {
    return this.productionBatchService.create(createProductionBatchDto);
  }

  @Get()
  async findAll() {
    return this.productionBatchService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productionBatchService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductionBatchDto: UpdateProductionBatchDto,
  ) {
    return this.productionBatchService.update(id, updateProductionBatchDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productionBatchService.remove(id);
  }
}