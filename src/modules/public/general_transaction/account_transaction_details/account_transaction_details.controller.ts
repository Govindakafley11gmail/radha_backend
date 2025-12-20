import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountTransactionDetailsService } from './account_transaction_details.service';
import { CreateAccountTransactionDetailDto } from './dto/create-account_transaction_detail.dto';
import { UpdateAccountTransactionDetailDto } from './dto/update-account_transaction_detail.dto';

@Controller('account-transaction-details')
export class AccountTransactionDetailsController {
  constructor(private readonly accountTransactionDetailsService: AccountTransactionDetailsService) {}

  @Post()
  async create(@Body() createAccountTransactionDetailDto: CreateAccountTransactionDetailDto) {
    return await this.accountTransactionDetailsService.create(createAccountTransactionDetailDto);
  }

  @Get()
  async findAll() {
    return await this.accountTransactionDetailsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.accountTransactionDetailsService.findOne(id); // UUID is string
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccountTransactionDetailDto: UpdateAccountTransactionDetailDto,
  ) {
    return await this.accountTransactionDetailsService.update(id, updateAccountTransactionDetailDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.accountTransactionDetailsService.remove(id);
  }
}
