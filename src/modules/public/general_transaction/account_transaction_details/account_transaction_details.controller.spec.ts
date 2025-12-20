import { Test, TestingModule } from '@nestjs/testing';
import { AccountTransactionDetailsController } from './account_transaction_details.controller';
import { AccountTransactionDetailsService } from './account_transaction_details.service';

describe('AccountTransactionDetailsController', () => {
  let controller: AccountTransactionDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountTransactionDetailsController],
      providers: [AccountTransactionDetailsService],
    }).compile();

    controller = module.get<AccountTransactionDetailsController>(AccountTransactionDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
