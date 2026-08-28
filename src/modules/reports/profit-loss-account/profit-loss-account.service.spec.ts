import { Test, TestingModule } from '@nestjs/testing';
import { ProfitLossAccountService } from './profit-loss-account.service';

describe('ProfitLossAccountService', () => {
  let service: ProfitLossAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfitLossAccountService],
    }).compile();

    service = module.get<ProfitLossAccountService>(ProfitLossAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
