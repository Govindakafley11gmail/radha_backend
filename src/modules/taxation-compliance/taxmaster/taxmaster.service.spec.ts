import { Test, TestingModule } from '@nestjs/testing';
import { TaxmasterService } from './taxmaster.service';

describe('TaxmasterService', () => {
  let service: TaxmasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxmasterService],
    }).compile();

    service = module.get<TaxmasterService>(TaxmasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
