import { Body, Controller, Get, Param, Post, Patch, Delete, UsePipes, ValidationPipe, HttpStatus } from '@nestjs/common';
import { CreateRawMaterialCostDto } from './dto/create-raw-material-cost.dto';
import { UpdateRawMaterialCostDto } from './dto/update-raw-material-cost.dto';
import { RawMaterialCostService } from './raw-material-cost.service';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('raw-material-cost')
export class RawMaterialCostController {
  constructor(private readonly rawMaterialCostService: RawMaterialCostService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createRawMaterialCostDto: CreateRawMaterialCostDto) {
    try {
      const rawMaterialCost = await this.rawMaterialCostService.create(createRawMaterialCostDto);
      return responseService.success(rawMaterialCost, 'Raw material cost created successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create raw material cost',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const rawMaterialCosts = await this.rawMaterialCostService.findAll();
      return responseService.success(rawMaterialCosts, 'Raw material costs fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch raw material costs',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const rawMaterialCost = await this.rawMaterialCostService.findOne(+id);
      return responseService.success(rawMaterialCost, 'Raw material cost fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch raw material cost',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() updateRawMaterialCostDto: UpdateRawMaterialCostDto) {
    try {
      const updatedRawMaterialCost = await this.rawMaterialCostService.update(+id, updateRawMaterialCostDto);
      return responseService.success(updatedRawMaterialCost, 'Raw material cost updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update raw material cost',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.rawMaterialCostService.remove(+id);
      return responseService.success(null, 'Raw material cost removed successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to remove raw material cost',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
