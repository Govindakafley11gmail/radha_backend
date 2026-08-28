import { Body, Controller, Post } from '@nestjs/common';
import { ProfitLossAccountService } from './profit-loss-account.service';

@Controller('profit-loss-account')
export class ProfitLossAccountController {
  constructor(private readonly service: ProfitLossAccountService) {}

  @Post()
  async getPL(
    @Body() body: { startDate: string; endDate: string },

  ) {
    const { startDate, endDate } = body;
    return this.service.getProfitLoss(startDate, endDate);
  }
}