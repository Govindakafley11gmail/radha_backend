import { PartialType } from '@nestjs/mapped-types';
import { CreateFinishedGoodsInventoryDto } from './create-finished-goods-inventory.dto';

export class UpdateFinishedGoodsInventoryDto extends PartialType(CreateFinishedGoodsInventoryDto) {}
