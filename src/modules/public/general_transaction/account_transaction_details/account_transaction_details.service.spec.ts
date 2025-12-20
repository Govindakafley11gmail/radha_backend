import { Test, TestingModule } from '@nestjs/testing';
import { AccountTransactionDetailsService } from './account_transaction_details.service';

describe('AccountTransactionDetailsService', () => {
  let service: AccountTransactionDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountTransactionDetailsService],
    }).compile();

    service = module.get<AccountTransactionDetailsService>(AccountTransactionDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
