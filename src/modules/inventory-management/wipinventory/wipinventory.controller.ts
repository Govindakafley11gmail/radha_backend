import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { WipinventoryService } from './wipinventory.service';
import { CreateWipinventoryDto } from './dto/create-wipinventory.dto';
import { UpdateWipinventoryDto } from './dto/update-wipinventory.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('wipinventory')
export class WipinventoryController {
  constructor(private readonly wipinventoryService: WipinventoryService) { }

  // ----------------------
  // CREATE WIP INVENTORY
  // ----------------------
  @Post()
  async create(@Body() createWipinventoryDto: CreateWipinventoryDto) {
    try {
      const inventory = await this.wipinventoryService.create(createWipinventoryDto);

      return responseService.success(
        inventory,
        'WIP inventory created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create WIP inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // GET ALL WIP INVENTORIES
  // ----------------------
  @Get()
  async findAll() {
    try {
      const inventories = await this.wipinventoryService.findAll();
      return responseService.success(inventories, 'WIP inventories fetched successfully', HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch WIP inventories',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // GET SINGLE WIP INVENTORY
  // ----------------------
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const inventory = await this.wipinventoryService.findOne(id);
      return responseService.success(inventory, 'WIP inventory fetched successfully', HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch WIP inventory',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // ----------------------
  // UPDATE WIP INVENTORY
  // ----------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWipinventoryDto: UpdateWipinventoryDto) {
    try {
      const updatedInventory = await this.wipinventoryService.update(id, updateWipinventoryDto);
      return responseService.success(updatedInventory, 'WIP inventory updated successfully', HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update WIP inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // DELETE WIP INVENTORY
  // ----------------------
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.wipinventoryService.remove(id);
      return responseService.success(null, 'WIP inventory deleted successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete WIP inventory',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
