import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AccountpostingService, CostEntry } from './accountposting.service';
import { CreateAccountpostingDto } from './dto/create-accountposting.dto';

@Controller('accountposting')
export class AccountpostingController {
  constructor(private readonly accountpostingService: AccountpostingService) {}

  @Post()
  create(@Body() createAccountpostingDto: CreateAccountpostingDto) {
    const voucherNo = createAccountpostingDto.voucherNo || 'PRODUCTION_COST';

    // Map DTO to service CostEntry[]
    const costEntries: CostEntry[] = createAccountpostingDto.costEntries.map((e) => ({
      accountId: e.accountId,
      debit: e.debit || 0,
      credit: e.credit || 0,
      referenceType: e.referenceType,
      referenceId: e.referenceId,
    }));

    return this.accountpostingService.postCosts(
      createAccountpostingDto.batchId,
      createAccountpostingDto.description,
      voucherNo,

      costEntries);
  }

  @Get()
  findAll() {
    return this.accountpostingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountpostingService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountpostingService.remove(id);
  }
}
