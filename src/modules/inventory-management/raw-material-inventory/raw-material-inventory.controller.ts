import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RawMaterialInventoryService } from './raw-material-inventory.service';
import { CreateRawMaterialInventoryDto } from './dto/create-raw-material-inventory.dto';
import { UpdateRawMaterialInventoryDto } from './dto/update-raw-material-inventory.dto';

@Controller('raw-material-inventory')
export class RawMaterialInventoryController {
  constructor(private readonly rawMaterialInventoryService: RawMaterialInventoryService) {}

  @Post()
  create(@Body() createRawMaterialInventoryDto: CreateRawMaterialInventoryDto) {
    return this.rawMaterialInventoryService.create(createRawMaterialInventoryDto);
  }

  @Get()
  findAll() {
    return this.rawMaterialInventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawMaterialInventoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRawMaterialInventoryDto: UpdateRawMaterialInventoryDto) {
    return this.rawMaterialInventoryService.update(+id, updateRawMaterialInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawMaterialInventoryService.remove(+id);
  }
}
