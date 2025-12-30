import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';

@Controller('pricelist')
export class PricelistController {
  constructor(private readonly pricelistService: PricelistService) {}

  @Post()
  create(@Body() createPricelistDto: CreatePricelistDto) {
    return this.pricelistService.create(createPricelistDto);
  }

  @Get()
  findAll() {
    return this.pricelistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricelistService.findOne(id); // UUID is string
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePricelistDto: UpdatePricelistDto) {
    return this.pricelistService.update(id, updatePricelistDto); // UUID is string
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricelistService.remove(id); // UUID is string
  }
}
