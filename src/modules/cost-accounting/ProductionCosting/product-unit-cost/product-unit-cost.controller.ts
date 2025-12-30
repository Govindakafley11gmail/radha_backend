import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductUnitCostService } from './product-unit-cost.service';
import { CreateProductUnitCostDto } from './dto/create-product-unit-cost.dto';
import { UpdateProductUnitCostDto } from './dto/update-product-unit-cost.dto';

@Controller('product-unit-cost')
export class ProductUnitCostController {
  constructor(private readonly productUnitCostService: ProductUnitCostService) {}

  @Post()
  create(@Body() createProductUnitCostDto: CreateProductUnitCostDto) {
    return this.productUnitCostService.create(createProductUnitCostDto);
  }

  @Get()
  findAll() {
    return this.productUnitCostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productUnitCostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductUnitCostDto: UpdateProductUnitCostDto) {
    return this.productUnitCostService.update(+id, updateProductUnitCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productUnitCostService.remove(+id);
  }
}
