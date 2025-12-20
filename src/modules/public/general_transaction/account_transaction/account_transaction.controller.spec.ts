import { Test, TestingModule } from '@nestjs/testing';
import { AccountTransactionController } from './account_transaction.controller';
import { AccountTransactionService } from './account_transaction.service';

describe('AccountTransactionController', () => {
  let controller: AccountTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountTransactionController],
      providers: [AccountTransactionService],
    }).compile();

    controller = module.get<AccountTransactionController>(AccountTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
