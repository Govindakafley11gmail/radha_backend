import { Test, TestingModule } from '@nestjs/testing';
import { TaxinvoiceService } from './taxinvoice.service';

describe('TaxinvoiceService', () => {
  let service: TaxinvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxinvoiceService],
    }).compile();

    service = module.get<TaxinvoiceService>(TaxinvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
