import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalarypaymentService } from './salarypayment.service';
import { CreateSalarypaymentDto } from './dto/create-salarypayment.dto';
import { UpdateSalarypaymentDto } from './dto/update-salarypayment.dto';

@Controller('salarypayment')
export class SalarypaymentController {
  constructor(private readonly salarypaymentService: SalarypaymentService) {}

  @Post()
  create(@Body() createSalarypaymentDto: CreateSalarypaymentDto) {
    return this.salarypaymentService.create(createSalarypaymentDto);
  }

  @Get()
  findAll() {
    return this.salarypaymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salarypaymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalarypaymentDto: UpdateSalarypaymentDto) {
    return this.salarypaymentService.update(+id, updateSalarypaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salarypaymentService.remove(+id);
  }
}
