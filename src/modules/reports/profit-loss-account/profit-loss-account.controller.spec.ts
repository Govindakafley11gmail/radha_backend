import { Test, TestingModule } from '@nestjs/testing';
import { ProfitLossAccountController } from './profit-loss-account.controller';
import { ProfitLossAccountService } from './profit-loss-account.service';

describe('ProfitLossAccountController', () => {
  let controller: ProfitLossAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfitLossAccountController],
      providers: [ProfitLossAccountService],
    }).compile();

    controller = module.get<ProfitLossAccountController>(ProfitLossAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
