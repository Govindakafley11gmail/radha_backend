import { Controller, Get, Post, Body, Patch, Param, HttpStatus } from '@nestjs/common';
import { MachineCostService } from './machine-cost.service';
import { CreateMachineCostDto } from './dto/create-machine-cost.dto';
import { UpdateMachineCostDto } from './dto/update-machine-cost.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('machine-cost')
export class MachineCostController {
  constructor(private readonly machineCostService: MachineCostService) {}

  // ----------------------
  // Create Machine Cost
  // ----------------------
  @Post()
  async create(@Body() createMachineCostDto: CreateMachineCostDto) {
    try {
      const cost = await this.machineCostService.create(createMachineCostDto);
      return responseService.success(
        cost,
        'Machine cost created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create machine cost',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // Get all Machine Costs
  // ----------------------
  @Get()
  async findAll() {
    try {
      const costs = await this.machineCostService.findAll();
      return responseService.success(costs, 'Machine costs retrieved successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch machine costs',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // Get single Machine Cost
  // ----------------------
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const cost = await this.machineCostService.findOne(id);
      return responseService.success(cost, 'Machine cost retrieved successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch machine cost',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // Update Machine Cost
  // ----------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMachineCostDto: UpdateMachineCostDto) {
    try {
      const cost = await this.machineCostService.update(id, updateMachineCostDto);
      return responseService.success(cost, 'Machine cost updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update machine cost',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // Delete Machine Cost
  // ----------------------
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   try {
  //     await this.machineCostService.remove(id);
  //     return responseService.success(null, 'Machine cost deleted successfully', HttpStatus.NO_CONTENT);
  //   } catch (error) {
  //     return responseService.error(
  //       error instanceof Error ? error.message : String(error),
  //       'Failed to delete machine cost',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
