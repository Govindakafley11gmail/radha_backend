import { Injectable } from '@nestjs/common';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';

@Injectable()
export class LaborService {
  create(createLaborDto: CreateLaborDto) {
    return 'This action adds a new labor';
  }

  findAll() {
    return `This action returns all labor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} labor`;
  }

  update(id: number, updateLaborDto: UpdateLaborDto) {
    return `This action updates a #${id} labor`;
  }

  remove(id: number) {
    return `This action removes a #${id} labor`;
  }
}
