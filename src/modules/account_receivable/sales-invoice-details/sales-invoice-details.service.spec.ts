import { Test, TestingModule } from '@nestjs/testing';
import { SalesInvoiceDetailsService } from './sales-invoice-details.service';

describe('SalesInvoiceDetailsService', () => {
  let service: SalesInvoiceDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesInvoiceDetailsService],
    }).compile();

    service = module.get<SalesInvoiceDetailsService>(SalesInvoiceDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
