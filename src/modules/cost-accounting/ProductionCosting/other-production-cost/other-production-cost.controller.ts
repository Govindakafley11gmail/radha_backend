import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtherProductionCostService } from './other-production-cost.service';
import { CreateOtherProductionCostDto } from './dto/create-other-production-cost.dto';
import { UpdateOtherProductionCostDto } from './dto/update-other-production-cost.dto';

@Controller('other-production-cost')
export class OtherProductionCostController {
  constructor(private readonly otherProductionCostService: OtherProductionCostService) {}

  @Post()
  create(@Body() createOtherProductionCostDto: CreateOtherProductionCostDto) {
    return this.otherProductionCostService.create(createOtherProductionCostDto);
  }

  @Get()
  findAll() {
    return this.otherProductionCostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otherProductionCostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOtherProductionCostDto: UpdateOtherProductionCostDto) {
    return this.otherProductionCostService.update(+id, updateOtherProductionCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otherProductionCostService.remove(+id);
  }
}
