import { Injectable } from '@nestjs/common';
import { CreateAccountpostingDto } from './dto/create-accountposting.dto';
import { UpdateAccountpostingDto } from './dto/update-accountposting.dto';

@Injectable()
export class AccountpostingService {
  create(createAccountpostingDto: CreateAccountpostingDto) {
    return 'This action adds a new accountposting';
  }

  findAll() {
    return `This action returns all accountposting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accountposting`;
  }

  update(id: number, updateAccountpostingDto: UpdateAccountpostingDto) {
    return `This action updates a #${id} accountposting`;
  }

  remove(id: number) {
    return `This action removes a #${id} accountposting`;
  }
}
