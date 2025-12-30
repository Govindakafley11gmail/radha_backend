import { Injectable } from '@nestjs/common';
import { CreateProductUnitCostDto } from './dto/create-product-unit-cost.dto';
import { UpdateProductUnitCostDto } from './dto/update-product-unit-cost.dto';

@Injectable()
export class ProductUnitCostService {
  create(createProductUnitCostDto: CreateProductUnitCostDto) {
    return 'This action adds a new productUnitCost';
  }

  findAll() {
    return `This action returns all productUnitCost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productUnitCost`;
  }

  update(id: number, updateProductUnitCostDto: UpdateProductUnitCostDto) {
    return `This action updates a #${id} productUnitCost`;
  }

  remove(id: number) {
    return `This action removes a #${id} productUnitCost`;
  }
}
