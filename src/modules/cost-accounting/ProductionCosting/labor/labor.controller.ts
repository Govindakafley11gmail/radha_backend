import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { LaborService } from './labor.service';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('labor')
export class LaborController {
  constructor(private readonly laborService: LaborService) {}

  // ----------------------
  // Create Labor Entry
  // ----------------------
  @Post()
  async create(@Body() createLaborDto: CreateLaborDto) {
    try {
      const labor = await this.laborService.create(createLaborDto);
      return responseService.success(
        labor,
        'Labor entry created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create labor entry',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // Get all Labor Entries
  // ----------------------
  @Get()
  async findAll() {
    try {
      const labors = await this.laborService.findAll();
      return responseService.success(labors, 'Labor entries retrieved successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch labor entries',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // Get single Labor Entry
  // ----------------------
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const labor = await this.laborService.findOne(id);
      return responseService.success(labor, 'Labor entry retrieved successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch labor entry',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // Update Labor Entry
  // ----------------------
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLaborDto: UpdateLaborDto) {
    try {
      const labor = await this.laborService.update(id, updateLaborDto);
      return responseService.success(labor, 'Labor entry updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update labor entry',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------
  // Delete Labor Entry
  // ----------------------
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.laborService.remove(id);
      return responseService.success(null, 'Labor entry deleted successfully', HttpStatus.NO_CONTENT);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to delete labor entry',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
