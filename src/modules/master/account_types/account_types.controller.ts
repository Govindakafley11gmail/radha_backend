import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';

import { ResponseService } from 'src/common/response/response';
import { AccountTypeService } from './account_types.service';
import { CreateAccountTypeDto } from './dto/create-account_type.dto';
import { UpdateAccountTypeDto } from './dto/update-account_type.dto';

@Controller('account-types')
export class AccountTypeController {
  constructor(
    private readonly service: AccountTypeService,
    private readonly response: ResponseService,
  ) {}

  @Post()
  async create(@Body() dto: CreateAccountTypeDto) {
    try {
      const type = await this.service.create(dto);
      return this.response.success(type, 'Account type created', HttpStatus.CREATED);
    } catch (err: any) {
      return this.response.error(err, 'Creation failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    const types = await this.service.findAll();
    return this.response.success(types, 'Account types fetched', HttpStatus.OK);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const type = await this.service.findOne(id);
    return this.response.success(type, 'Account type fetched', HttpStatus.OK);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAccountTypeDto) {
    const type = await this.service.update(id, dto);
    return this.response.success(type, 'Account type updated', HttpStatus.OK);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return this.response.success(null, 'Account type deleted', HttpStatus.OK);
  }
}
