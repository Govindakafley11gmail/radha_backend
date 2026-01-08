import { Test, TestingModule } from '@nestjs/testing';
import { AccountpostingController } from './accountposting.controller';
import { AccountpostingService } from './accountposting.service';

describe('AccountpostingController', () => {
  let controller: AccountpostingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountpostingController],
      providers: [AccountpostingService],
    }).compile();

    controller = module.get<AccountpostingController>(AccountpostingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
