import { Injectable } from '@nestjs/common';
import { CreateMachineCostDto } from './dto/create-machine-cost.dto';
import { UpdateMachineCostDto } from './dto/update-machine-cost.dto';

@Injectable()
export class MachineCostService {
  create(createMachineCostDto: CreateMachineCostDto) {
    return 'This action adds a new machineCost';
  }

  findAll() {
    return `This action returns all machineCost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} machineCost`;
  }

  update(id: number, updateMachineCostDto: UpdateMachineCostDto) {
    return `This action updates a #${id} machineCost`;
  }

  remove(id: number) {
    return `This action removes a #${id} machineCost`;
  }
}
