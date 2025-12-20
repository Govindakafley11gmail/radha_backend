import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountTransactionService } from './account_transaction.service';
import { CreateAccountTransactionDto } from './dto/create-account_transaction.dto';
import { UpdateAccountTransactionDto } from './dto/update-account_transaction.dto';

@Controller('account-transaction')
export class AccountTransactionController {
  constructor(private readonly accountTransactionService: AccountTransactionService) {}

  @Post()
  async create(@Body() createAccountTransactionDto: CreateAccountTransactionDto) {
    return await this.accountTransactionService.create(createAccountTransactionDto);
  }

  @Get()
  async findAll() {
    return await this.accountTransactionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.accountTransactionService.findOne(id); // UUID is string
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccountTransactionDto: UpdateAccountTransactionDto,
  ) {
    return await this.accountTransactionService.update(id, updateAccountTransactionDto); // UUID is string
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.accountTransactionService.remove(id); // UUID is string
  }
}
