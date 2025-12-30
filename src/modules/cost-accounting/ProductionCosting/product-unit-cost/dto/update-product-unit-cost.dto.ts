import { PartialType } from '@nestjs/mapped-types';
import { CreateProductUnitCostDto } from './create-product-unit-cost.dto';

export class UpdateProductUnitCostDto extends PartialType(CreateProductUnitCostDto) {}
