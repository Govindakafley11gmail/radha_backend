import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaxmasterService } from './taxmaster.service';
import { CreateTaxmasterDto } from './dto/create-taxmaster.dto';
import { UpdateTaxmasterDto } from './dto/update-taxmaster.dto';

@Controller('taxmaster')
export class TaxmasterController {
  constructor(private readonly taxmasterService: TaxmasterService) {}

  @Post()
  create(@Body() createTaxmasterDto: CreateTaxmasterDto) {
    return this.taxmasterService.create(createTaxmasterDto);
  }

  @Get()
  findAll() {
    return this.taxmasterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxmasterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaxmasterDto: UpdateTaxmasterDto) {
    return this.taxmasterService.update(+id, updateTaxmasterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxmasterService.remove(+id);
  }
}
