import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTransactionDetail } from './entities/account_transaction_detail.entity';
import { CreateAccountTransactionDetailDto } from './dto/create-account_transaction_detail.dto';
import { UpdateAccountTransactionDetailDto } from './dto/update-account_transaction_detail.dto';

@Injectable()
export class AccountTransactionDetailsService {
  constructor(
    @InjectRepository(AccountTransactionDetail)
    private readonly accountTransactionDetailRepository: Repository<AccountTransactionDetail>,
  ) {}

  async create(createAccountTransactionDetailDto: CreateAccountTransactionDetailDto): Promise<AccountTransactionDetail> {
    const detail = this.accountTransactionDetailRepository.create(createAccountTransactionDetailDto);
    return await this.accountTransactionDetailRepository.save(detail);
  }

  async findAll(): Promise<AccountTransactionDetail[]> {
    return await this.accountTransactionDetailRepository.find({
      where: { isDeleted: false },
    });
  }

  async findOne(id: string): Promise<AccountTransactionDetail> {
    const detail = await this.accountTransactionDetailRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!detail) {
      throw new NotFoundException(`AccountTransactionDetail with id ${id} not found`);
    }
    return detail;
  }

  async update(id: string, updateAccountTransactionDetailDto: UpdateAccountTransactionDetailDto): Promise<AccountTransactionDetail> {
    const detail = await this.findOne(id);
    Object.assign(detail, updateAccountTransactionDetailDto);
    return await this.accountTransactionDetailRepository.save(detail);
  }

  async remove(id: string): Promise<void> {
    const detail = await this.findOne(id);
    detail.isDeleted = true;
    await this.accountTransactionDetailRepository.save(detail);
  }
}
