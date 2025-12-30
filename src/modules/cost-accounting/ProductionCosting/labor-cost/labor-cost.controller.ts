import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LaborCostService } from './labor-cost.service';
import { CreateLaborCostDto } from './dto/create-labor-cost.dto';
import { UpdateLaborCostDto } from './dto/update-labor-cost.dto';

@Controller('labor-cost')
export class LaborCostController {
  constructor(private readonly laborCostService: LaborCostService) {}

  @Post()
  create(@Body() createLaborCostDto: CreateLaborCostDto) {
    return this.laborCostService.create(createLaborCostDto);
  }

  @Get()
  findAll() {
    return this.laborCostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.laborCostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLaborCostDto: UpdateLaborCostDto) {
    return this.laborCostService.update(+id, updateLaborCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laborCostService.remove(+id);
  }
}
