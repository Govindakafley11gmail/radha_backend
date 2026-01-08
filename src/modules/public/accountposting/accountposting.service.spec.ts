import { Test, TestingModule } from '@nestjs/testing';
import { AccountpostingService } from './accountposting.service';

describe('AccountpostingService', () => {
  let service: AccountpostingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountpostingService],
    }).compile();

    service = module.get<AccountpostingService>(AccountpostingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
