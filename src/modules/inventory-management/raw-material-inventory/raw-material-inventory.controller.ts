/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { RawMaterialInventoryService } from './raw-material-inventory.service';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('raw-material-inventory')
export class RawMaterialInventoryController {
  constructor(
    private readonly rawMaterialInventoryService: RawMaterialInventoryService,
  ) {}

  // ----------------------
  // CREATE INVENTORY
  // ----------------------
  @Post()
  async create(@Body() body: any) {
    try {
      const inventory = await this.rawMaterialInventoryService.create(body);
      return responseService.success(
        inventory,
        'Inventory created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // UPDATE INVENTORY
  // ----------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      const inventory = await this.rawMaterialInventoryService.update(id, body);
      return responseService.success(
        inventory,
        'Inventory updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // DELETE INVENTORY
  // ----------------------
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.rawMaterialInventoryService.remove(id);
      return responseService.success(
        null,
        'Inventory deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // ADD RECEIPT TO INVENTORY
  // ----------------------
  @Post(':id/receipt')
  async addReceipt(
    @Param('id') inventoryId: string,
    @Body() body: { quantityReceived: number; unitCost: number },
  ) {
    try {
      const { quantityReceived, unitCost } = body;
      const receipt = await this.rawMaterialInventoryService.addReceipt(
        inventoryId,
        quantityReceived,
        unitCost,
      );

      return responseService.success(
        receipt,
        'Receipt added successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to add receipt',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // GET ALL INVENTORIES
  // ----------------------
  @Get()
  async findAll() {
    try {
      const inventories = await this.rawMaterialInventoryService.findAll();
      return responseService.success(
        inventories,
        'Fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch inventories',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // GET SINGLE INVENTORY
  // ----------------------
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const inventory = await this.rawMaterialInventoryService.findOne(id);
      return responseService.success(
        inventory,
        'Fetched successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Inventory not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
