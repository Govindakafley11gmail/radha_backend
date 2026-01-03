import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinishedGoodsInventoryService } from './finished-goods-inventory.service';
import { CreateFinishedGoodsInventoryDto } from './dto/create-finished-goods-inventory.dto';
import { UpdateFinishedGoodsInventoryDto } from './dto/update-finished-goods-inventory.dto';

@Controller('finished-goods-inventory')
export class FinishedGoodsInventoryController {
  constructor(private readonly finishedGoodsInventoryService: FinishedGoodsInventoryService) {}

  @Post()
  create(@Body() createFinishedGoodsInventoryDto: CreateFinishedGoodsInventoryDto) {
    return this.finishedGoodsInventoryService.create(createFinishedGoodsInventoryDto);
  }

  @Get()
  findAll() {
    return this.finishedGoodsInventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finishedGoodsInventoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinishedGoodsInventoryDto: UpdateFinishedGoodsInventoryDto) {
    return this.finishedGoodsInventoryService.update(+id, updateFinishedGoodsInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finishedGoodsInventoryService.remove(+id);
  }
}
