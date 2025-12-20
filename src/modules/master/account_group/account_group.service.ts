import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountGroupDto } from './dto/create-account_group.dto';
import { UpdateAccountGroupDto } from './dto/update-account_group.dto';
import { AccountGroup } from './entities/account_group.entity';

@Injectable()
export class AccountGroupService {
  constructor(
    @InjectRepository(AccountGroup)
    private accountGroupRepository: Repository<AccountGroup>,
  ) {}

 async create(createAccountGroupDto: CreateAccountGroupDto): Promise<AccountGroup> {
  // Generate a unique code, for example: first 3 letters of name + timestamp
  const code = `${createAccountGroupDto.name.substring(0, 3).toUpperCase()}${Date.now()}`;

  // Merge the generated code into the DTO
  const createGroupData = {
    ...createAccountGroupDto,
    code,
  };

  // Create the entity using the repository
  const accountGroup = this.accountGroupRepository.create(createGroupData);

  // Save and return the entity
  return this.accountGroupRepository.save(accountGroup);
}

  async findAll(): Promise<AccountGroup[]> {
    return this.accountGroupRepository.find();
  }

  async findOne(id: string): Promise<AccountGroup> {
    const accountGroup = await this.accountGroupRepository.findOne({ where: { id } });
    if (!accountGroup) throw new NotFoundException(`AccountGroup with id ${id} not found`);
    return accountGroup;
  }

  async update(id: string, updateAccountGroupDto: UpdateAccountGroupDto): Promise<AccountGroup> {
    const accountGroup = await this.findOne(id);
    Object.assign(accountGroup, updateAccountGroupDto);
    return this.accountGroupRepository.save(accountGroup);
  }

  async remove(id: string): Promise<void> {
    const accountGroup = await this.findOne(id);
    await this.accountGroupRepository.remove(accountGroup);
  }
}
