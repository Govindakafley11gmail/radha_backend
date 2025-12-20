import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountTransactionDto } from './dto/create-account_transaction.dto';
import { UpdateAccountTransactionDto } from './dto/update-account_transaction.dto';
import { AccountTransaction } from './entities/account_transaction.entity';

@Injectable()
export class AccountTransactionService {
  constructor(
    @InjectRepository(AccountTransaction)
    private readonly accountTransactionRepository: Repository<AccountTransaction>,
  ) {}

  async create(createAccountTransactionDto: CreateAccountTransactionDto): Promise<AccountTransaction> {
    const transaction = this.accountTransactionRepository.create(createAccountTransactionDto);
    return await this.accountTransactionRepository.save(transaction);
  }

  async findAll(): Promise<AccountTransaction[]> {
    return await this.accountTransactionRepository.find({
      relations: ['details'], // fetch transaction details if needed
      where: { isDeleted: false },
    });
  }

  async findOne(id: string): Promise<AccountTransaction> {
    const transaction = await this.accountTransactionRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['details'],
    });
    if (!transaction) {
      throw new NotFoundException(`AccountTransaction with id ${id} not found`);
    }
    return transaction;
  }

  async update(id: string, updateAccountTransactionDto: UpdateAccountTransactionDto): Promise<AccountTransaction> {
    const transaction = await this.findOne(id);
    Object.assign(transaction, updateAccountTransactionDto);
    return await this.accountTransactionRepository.save(transaction);
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.findOne(id);
    transaction.isDeleted = true;
    await this.accountTransactionRepository.save(transaction);
  }
}
