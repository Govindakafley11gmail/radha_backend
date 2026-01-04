/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpStatus } from '@nestjs/common';
import { RawMaterialInventoryService } from './raw-material-inventory.service';
import { CreateRawMaterialInventoryDto } from './dto/create-raw-material-inventory.dto';
import { UpdateRawMaterialInventoryDto } from './dto/update-raw-material-inventory.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('raw-material-inventory')
export class RawMaterialInventoryController {
  constructor(private readonly rawMaterialInventoryService: RawMaterialInventoryService) {}

  // ----------------------
  // CREATE INVENTORY
  // ----------------------
  @Post()
  async create(@Body() createDto: CreateRawMaterialInventoryDto, @Req() req) {
    try {
      const userId = req.user?.id;
      const inventory = await this.rawMaterialInventoryService.create(createDto, userId);
      return responseService.success(inventory, 'Raw material inventory created successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create inventory',
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
      // const userId = req.user?.id;
      const { quantityReceived, unitCost } = body;
      const receipt = await this.rawMaterialInventoryService.addReceipt(
        inventoryId,
        quantityReceived,
        unitCost,
        // userId,
      );
      return responseService.success(receipt, 'Receipt added successfully', HttpStatus.CREATED);
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
      return responseService.success(inventories, 'Fetched successfully', HttpStatus.OK);
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
      return responseService.success(inventory, 'Fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Inventory not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // ----------------------
  // UPDATE INVENTORY
  // ----------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateRawMaterialInventoryDto) {
    try {
      const inventory = await this.rawMaterialInventoryService.update(id, updateDto);
      return responseService.success(inventory, 'Updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update',
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
      return responseService.success(null, 'Inventory removed successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to remove inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
