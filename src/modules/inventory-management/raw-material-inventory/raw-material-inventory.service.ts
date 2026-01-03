import { Injectable } from '@nestjs/common';
import { CreateRawMaterialInventoryDto } from './dto/create-raw-material-inventory.dto';
import { UpdateRawMaterialInventoryDto } from './dto/update-raw-material-inventory.dto';

@Injectable()
export class RawMaterialInventoryService {
  create(createRawMaterialInventoryDto: CreateRawMaterialInventoryDto) {
    return 'This action adds a new rawMaterialInventory';
  }

  findAll() {
    return `This action returns all rawMaterialInventory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rawMaterialInventory`;
  }

  update(id: number, updateRawMaterialInventoryDto: UpdateRawMaterialInventoryDto) {
    return `This action updates a #${id} rawMaterialInventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} rawMaterialInventory`;
  }
}
