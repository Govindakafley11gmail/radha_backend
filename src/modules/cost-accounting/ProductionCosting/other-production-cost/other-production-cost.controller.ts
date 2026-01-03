import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { OtherProductionCostService } from './other-production-cost.service';
import { CreateOtherProductionCostDto } from './dto/create-other-production-cost.dto';
import { UpdateOtherProductionCostDto } from './dto/update-other-production-cost.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('other-production-cost')
export class OtherProductionCostController {
  constructor(private readonly otherProductionCostService: OtherProductionCostService) {}

  // ----------------------
  // CREATE Other Production Cost
  // ----------------------
  @Post()
  async create(@Body() createDto: CreateOtherProductionCostDto) {
    try {
      const cost = await this.otherProductionCostService.create(createDto);
      return responseService.success(
        cost,
        'Other production cost created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create other production cost',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // GET ALL Other Production Costs
  // ----------------------
  @Get()
  async findAll() {
    try {
      const costs = await this.otherProductionCostService.findAll();
      return responseService.success(
        costs,
        'Other production costs retrieved successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to retrieve other production costs',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // GET SINGLE Other Production Cost
  // ----------------------
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const cost = await this.otherProductionCostService.findOne(id);
      return responseService.success(
        cost,
        'Other production cost retrieved successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to retrieve other production cost with ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // ----------------------
  // UPDATE Other Production Cost
  // ----------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateOtherProductionCostDto) {
    try {
      const cost = await this.otherProductionCostService.update(id, updateDto);
      return responseService.success(
        cost,
        'Other production cost updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to update other production cost with ID ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // DELETE Other Production Cost
  // ----------------------
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.otherProductionCostService.remove(id);
      return responseService.success(
        null,
        'Other production cost deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to delete other production cost with ID ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
