import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { RawMaterialService } from './raw-material.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { ResponseService } from 'src/common/response/response';

const responseService = new ResponseService();

@Controller('raw-material')
export class RawMaterialController {
  constructor(private readonly rawMaterialService: RawMaterialService) {}

  @Post()
  async create(@Body() createRawMaterialDto: CreateRawMaterialDto) {
    try {
      const rawMaterial = await this.rawMaterialService.create(createRawMaterialDto);
      return responseService.success(rawMaterial, 'Raw material created successfully', HttpStatus.CREATED);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create raw material',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const rawMaterials = await this.rawMaterialService.findAll();
      return responseService.success(rawMaterials, 'Raw materials fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch raw materials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const rawMaterial = await this.rawMaterialService.findOne(+id);
      return responseService.success(rawMaterial, 'Raw material fetched successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch raw material',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRawMaterialDto: UpdateRawMaterialDto) {
    try {
      const updatedRawMaterial = await this.rawMaterialService.update(+id, updateRawMaterialDto);
      return responseService.success(updatedRawMaterial, 'Raw material updated successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to update raw material',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.rawMaterialService.remove(+id);
      return responseService.success(null, 'Raw material removed successfully', HttpStatus.OK);
    } catch (error) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to remove raw material',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
