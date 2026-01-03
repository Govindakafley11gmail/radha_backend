import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WipinventoryService } from './wipinventory.service';
import { CreateWipinventoryDto } from './dto/create-wipinventory.dto';
import { UpdateWipinventoryDto } from './dto/update-wipinventory.dto';

@Controller('wipinventory')
export class WipinventoryController {
  constructor(private readonly wipinventoryService: WipinventoryService) {}

  @Post()
  create(@Body() createWipinventoryDto: CreateWipinventoryDto) {
    return this.wipinventoryService.create(createWipinventoryDto);
  }

  @Get()
  findAll() {
    return this.wipinventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wipinventoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWipinventoryDto: UpdateWipinventoryDto) {
    return this.wipinventoryService.update(+id, updateWipinventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wipinventoryService.remove(+id);
  }
}
