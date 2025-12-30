import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LaborService } from './labor.service';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';

@Controller('labor')
export class LaborController {
  constructor(private readonly laborService: LaborService) {}

  @Post()
  create(@Body() createLaborDto: CreateLaborDto) {
    return this.laborService.create(createLaborDto);
  }

  @Get()
  findAll() {
    return this.laborService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.laborService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLaborDto: UpdateLaborDto) {
    return this.laborService.update(+id, updateLaborDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laborService.remove(+id);
  }
}
