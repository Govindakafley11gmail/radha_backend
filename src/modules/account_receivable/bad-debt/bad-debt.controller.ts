import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BadDebtService } from './bad-debt.service';
import { CreateBadDebtDto } from './dto/create-bad-debt.dto';
import { UpdateBadDebtDto } from './dto/update-bad-debt.dto';

@Controller('bad-debt')
export class BadDebtController {
  constructor(private readonly badDebtService: BadDebtService) {}

  @Post()
  create(@Body() createBadDebtDto: CreateBadDebtDto) {
    return this.badDebtService.create(createBadDebtDto);
  }

  @Get()
  findAll() {
    return this.badDebtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badDebtService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBadDebtDto: UpdateBadDebtDto) {
    return this.badDebtService.update(id, updateBadDebtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.badDebtService.remove(id);
  }
}
