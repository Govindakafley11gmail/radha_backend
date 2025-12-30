import { Injectable } from '@nestjs/common';
import { CreateTaxmasterDto } from './dto/create-taxmaster.dto';
import { UpdateTaxmasterDto } from './dto/update-taxmaster.dto';

@Injectable()
export class TaxmasterService {
  create(createTaxmasterDto: CreateTaxmasterDto) {
    return 'This action adds a new taxmaster';
  }

  findAll() {
    return `This action returns all taxmaster`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taxmaster`;
  }

  update(id: number, updateTaxmasterDto: UpdateTaxmasterDto) {
    return `This action updates a #${id} taxmaster`;
  }

  remove(id: number) {
    return `This action removes a #${id} taxmaster`;
  }
}
