import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalesReturnService } from './sales-return.service';
import { CreateSalesReturnDto } from './dto/create-sales-return.dto';
import { UpdateSalesReturnDto } from './dto/update-sales-return.dto';

@Controller('sales-return')
export class SalesReturnController {
  constructor(
    private readonly salesReturnService: SalesReturnService,
  ) {}

  @Post()
  create(@Body() dto: CreateSalesReturnDto) {
    return this.salesReturnService.create(dto);
  }

  @Get()
  findAll() {
    return this.salesReturnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesReturnService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSalesReturnDto,
  ) {
    return this.salesReturnService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesReturnService.remove(id);
  }
}
