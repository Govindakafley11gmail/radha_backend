import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountpostingService } from './accountposting.service';
import { CreateAccountpostingDto } from './dto/create-accountposting.dto';
import { UpdateAccountpostingDto } from './dto/update-accountposting.dto';

@Controller('accountposting')
export class AccountpostingController {
  constructor(private readonly accountpostingService: AccountpostingService) {}

  @Post()
  create(@Body() createAccountpostingDto: CreateAccountpostingDto) {
    return this.accountpostingService.create(createAccountpostingDto);
  }

  @Get()
  findAll() {
    return this.accountpostingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountpostingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountpostingDto: UpdateAccountpostingDto) {
    return this.accountpostingService.update(+id, updateAccountpostingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountpostingService.remove(+id);
  }
}
