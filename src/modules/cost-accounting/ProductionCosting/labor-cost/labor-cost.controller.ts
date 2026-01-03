import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { LaborCostService } from './labor-cost.service';
import { CreateLaborCostDto } from './dto/create-labor-cost.dto';
import { UpdateLaborCostDto } from './dto/update-labor-cost.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('labor-cost')
export class LaborCostController {
  constructor(private readonly laborCostService: LaborCostService) {}

  // ----------------------
  // CREATE Labor Cost
  // ----------------------
  @Post()
  async create(@Body() createLaborCostDto: CreateLaborCostDto) {
    try {
      const laborCost = await this.laborCostService.create(createLaborCostDto);
      return responseService.success(
        laborCost,
        'Labor cost created successfully',
        HttpStatus.CREATED
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create labor cost',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ----------------------
  // GET all labor costs
  // ----------------------
  @Get()
  async findAll() {
    try {
      const laborCosts = await this.laborCostService.findAll();
      return responseService.success(
        laborCosts,
        'Labor costs retrieved successfully',
        HttpStatus.OK
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to retrieve labor costs',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ----------------------
  // GET single labor cost
  // ----------------------
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const laborCost = await this.laborCostService.findOne(+id);
      return responseService.success(
        laborCost,
        'Labor cost retrieved successfully',
        HttpStatus.OK
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to retrieve labor cost',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ----------------------
  // UPDATE labor cost
  // ----------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLaborCostDto: UpdateLaborCostDto) {
    try {
      const laborCost = await this.laborCostService.update(+id, updateLaborCostDto);
      return responseService.success(
        laborCost,
        'Labor cost updated successfully',
        HttpStatus.OK
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update labor cost',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ----------------------
  // DELETE labor cost
  // ----------------------
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.laborCostService.remove(+id);
      return responseService.success(
        null,
        'Labor cost deleted successfully',
        HttpStatus.NO_CONTENT
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete labor cost',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
