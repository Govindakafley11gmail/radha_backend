import { Injectable } from '@nestjs/common';
import { CreateWipinventoryDto } from './dto/create-wipinventory.dto';
import { UpdateWipinventoryDto } from './dto/update-wipinventory.dto';

@Injectable()
export class WipinventoryService {
  create(createWipinventoryDto: CreateWipinventoryDto) {
    return 'This action adds a new wipinventory';
  }

  findAll() {
    return `This action returns all wipinventory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wipinventory`;
  }

  update(id: number, updateWipinventoryDto: UpdateWipinventoryDto) {
    return `This action updates a #${id} wipinventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} wipinventory`;
  }
}
