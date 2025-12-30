import { Controller, Get,  Body, Patch, Param, Delete } from '@nestjs/common';
import { TaxinvoiceService } from './taxinvoice.service';
import { UpdateTaxinvoiceDto } from './dto/update-taxinvoice.dto';

@Controller('taxinvoice')
export class TaxinvoiceController {
  constructor(private readonly taxinvoiceService: TaxinvoiceService) {}

  // @Post()
  // create(@Body() createTaxinvoiceDto: CreateTaxinvoiceDto) {
  //   return this.taxinvoiceService.create(createTaxinvoiceDto);
  // }

  @Get()
  findAll() {
    return this.taxinvoiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxinvoiceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaxinvoiceDto: UpdateTaxinvoiceDto) {
    return this.taxinvoiceService.update(id, updateTaxinvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxinvoiceService.remove(id);
  }
}
