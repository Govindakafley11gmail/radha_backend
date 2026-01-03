import { Injectable } from '@nestjs/common';
import { CreateFinishedGoodsInventoryDto } from './dto/create-finished-goods-inventory.dto';
import { UpdateFinishedGoodsInventoryDto } from './dto/update-finished-goods-inventory.dto';

@Injectable()
export class FinishedGoodsInventoryService {
  create(createFinishedGoodsInventoryDto: CreateFinishedGoodsInventoryDto) {
    return 'This action adds a new finishedGoodsInventory';
  }

  findAll() {
    return `This action returns all finishedGoodsInventory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finishedGoodsInventory`;
  }

  update(id: number, updateFinishedGoodsInventoryDto: UpdateFinishedGoodsInventoryDto) {
    return `This action updates a #${id} finishedGoodsInventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} finishedGoodsInventory`;
  }
}
