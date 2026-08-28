import { Body, Controller, Post } from '@nestjs/common';
import { BalanceSheetService } from './balance-sheet.service';

@Controller('balance-sheet')
export class BalanceSheetController {
  constructor(private readonly balanceSheetService: BalanceSheetService) {}

  @Post()
  async getBalanceSheet(@Body() body: { startDate: string; endDate: string }) {
    const {  endDate } = body;
    return await this.balanceSheetService.generateBalanceSheet( endDate);
  }
}
