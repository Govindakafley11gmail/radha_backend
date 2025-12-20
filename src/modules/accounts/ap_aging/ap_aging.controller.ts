import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApAgingService } from './ap_aging.service';
import { CreateApAgingDto } from './dto/create-ap_aging.dto';
import { UpdateApAgingDto } from './dto/update-ap_aging.dto';

@Controller('ap-aging')
export class ApAgingController {
  constructor(private readonly apAgingService: ApAgingService) {}

  @Post()
  create(@Body() createApAgingDto: CreateApAgingDto) {
    return this.apAgingService.create(createApAgingDto);
  }

  @Get()
  findAll() {
    return this.apAgingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apAgingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApAgingDto: UpdateApAgingDto) {
    return this.apAgingService.update(+id, updateApAgingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apAgingService.remove(+id);
  }
}
