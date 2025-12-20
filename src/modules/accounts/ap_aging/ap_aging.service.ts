import { Injectable } from '@nestjs/common';
import { CreateApAgingDto } from './dto/create-ap_aging.dto';
import { UpdateApAgingDto } from './dto/update-ap_aging.dto';

@Injectable()
export class ApAgingService {
  create(createApAgingDto: CreateApAgingDto) {
    return 'This action adds a new apAging';
  }

  findAll() {
    return `This action returns all apAging`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apAging`;
  }

  update(id: number, updateApAgingDto: UpdateApAgingDto) {
    return `This action updates a #${id} apAging`;
  }

  remove(id: number) {
    return `This action removes a #${id} apAging`;
  }
}
