/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpStatus } from '@nestjs/common';
import { FinishedGoodsInventoryService } from './finished-goods-inventory.service';
import { CreateFinishedGoodsInventoryDto } from './dto/create-finished-goods-inventory.dto';
import { UpdateFinishedGoodsInventoryDto } from './dto/update-finished-goods-inventory.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('finished-goods-inventory')
export class FinishedGoodsInventoryController {
  constructor(private readonly inventoryService: FinishedGoodsInventoryService) {}

  @Post()
  async create(@Body() dto: CreateFinishedGoodsInventoryDto, @Req() req) {
    try {
      const userId = req.user.id;
      const inventory = await this.inventoryService.create(dto, userId);
      return responseService.success(inventory, 'Finished goods inventory created', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create finished goods inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const inventories = await this.inventoryService.findAll();
      return responseService.success(inventories, 'Finished goods inventories fetched',   HttpStatus.OK,);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch finished goods inventories',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const inventory = await this.inventoryService.findOne(id);
      return responseService.success(inventory, 'Finished goods inventory fetched',   HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch finished goods inventory',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFinishedGoodsInventoryDto) {
    try {
      const inventory = await this.inventoryService.update(id, dto);
      return responseService.success(inventory, 'Finished goods inventory updated',   HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update finished goods inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.inventoryService.remove(id);
      return responseService.success(null, 'Finished goods inventory deleted', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete finished goods inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
