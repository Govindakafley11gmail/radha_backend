import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MachineCostService } from './machine-cost.service';
import { CreateMachineCostDto } from './dto/create-machine-cost.dto';
import { UpdateMachineCostDto } from './dto/update-machine-cost.dto';

@Controller('machine-cost')
export class MachineCostController {
  constructor(private readonly machineCostService: MachineCostService) {}

  @Post()
  create(@Body() createMachineCostDto: CreateMachineCostDto) {
    return this.machineCostService.create(createMachineCostDto);
  }

  @Get()
  findAll() {
    return this.machineCostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.machineCostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMachineCostDto: UpdateMachineCostDto) {
    return this.machineCostService.update(+id, updateMachineCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machineCostService.remove(+id);
  }
}
