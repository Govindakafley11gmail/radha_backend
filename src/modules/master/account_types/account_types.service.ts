import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountGroup } from '../account_group/entities/account_group.entity';
import { CreateAccountTypeDto } from './dto/create-account_type.dto';
import { UpdateAccountTypeDto } from './dto/update-account_type.dto';
import { AccountType } from './entities/account_type.entity';

@Injectable()
export class AccountTypeService {
  constructor(
    @InjectRepository(AccountType)
    private accountTypeRepository: Repository<AccountType>,
    @InjectRepository(AccountGroup)
    private accountGroupRepository: Repository<AccountGroup>,
  ) {}

  async create(createDto: CreateAccountTypeDto): Promise<AccountType> {
    const group = await this.accountGroupRepository.findOne({ where: { id: createDto.groupId } });
    if (!group) throw new NotFoundException(`AccountGroup with id ${createDto.groupId} not found`);

    const accountType = this.accountTypeRepository.create({
      ...createDto,
      group,
    });

    return this.accountTypeRepository.save(accountType);
  }

  async findAll(): Promise<AccountType[]> {
    return this.accountTypeRepository.find({ relations: ['group'] });
  }

  async findOne(id: string): Promise<AccountType> {
    const type = await this.accountTypeRepository.findOne({ where: { id }, relations: ['group'] });
    if (!type) throw new NotFoundException(`AccountType with id ${id} not found`);
    return type;
  }

  async update(id: string, updateDto: UpdateAccountTypeDto): Promise<AccountType> {
    const type = await this.findOne(id);

    if (updateDto.groupId) {
      const group = await this.accountGroupRepository.findOne({ where: { id: updateDto.groupId } });
      if (!group) throw new NotFoundException(`AccountGroup with id ${updateDto.groupId} not found`);
      type.group = group;
    }

    Object.assign(type, updateDto);
    return this.accountTypeRepository.save(type);
  }

  async remove(id: string): Promise<void> {
    const type = await this.findOne(id);
    await this.accountTypeRepository.remove(type);
  }
}
