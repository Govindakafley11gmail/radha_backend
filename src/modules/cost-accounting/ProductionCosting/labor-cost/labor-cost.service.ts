import { Injectable } from '@nestjs/common';
import { CreateLaborCostDto } from './dto/create-labor-cost.dto';
import { UpdateLaborCostDto } from './dto/update-labor-cost.dto';

@Injectable()
export class LaborCostService {
  create(createLaborCostDto: CreateLaborCostDto) {
    return 'This action adds a new laborCost';
  }

  findAll() {
    return `This action returns all laborCost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} laborCost`;
  }

  update(id: number, updateLaborCostDto: UpdateLaborCostDto) {
    return `This action updates a #${id} laborCost`;
  }

  remove(id: number) {
    return `This action removes a #${id} laborCost`;
  }
}
