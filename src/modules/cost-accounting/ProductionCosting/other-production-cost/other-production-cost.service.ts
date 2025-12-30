import { Injectable } from '@nestjs/common';
import { CreateOtherProductionCostDto } from './dto/create-other-production-cost.dto';
import { UpdateOtherProductionCostDto } from './dto/update-other-production-cost.dto';

@Injectable()
export class OtherProductionCostService {
  create(createOtherProductionCostDto: CreateOtherProductionCostDto) {
    return 'This action adds a new otherProductionCost';
  }

  findAll() {
    return `This action returns all otherProductionCost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otherProductionCost`;
  }

  update(id: number, updateOtherProductionCostDto: UpdateOtherProductionCostDto) {
    return `This action updates a #${id} otherProductionCost`;
  }

  remove(id: number) {
    return `This action removes a #${id} otherProductionCost`;
  }
}
