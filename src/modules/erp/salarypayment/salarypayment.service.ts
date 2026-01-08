import { Injectable } from '@nestjs/common';
import { CreateSalarypaymentDto } from './dto/create-salarypayment.dto';
import { UpdateSalarypaymentDto } from './dto/update-salarypayment.dto';

@Injectable()
export class SalarypaymentService {
  create(createSalarypaymentDto: CreateSalarypaymentDto) {
    return 'This action adds a new salarypayment';
  }

  findAll() {
    return `This action returns all salarypayment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salarypayment`;
  }

  update(id: number, updateSalarypaymentDto: UpdateSalarypaymentDto) {
    return `This action updates a #${id} salarypayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} salarypayment`;
  }
}
