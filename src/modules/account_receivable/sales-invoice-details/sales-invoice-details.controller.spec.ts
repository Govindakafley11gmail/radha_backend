import { Test, TestingModule } from '@nestjs/testing';
import { SalesInvoiceDetailsController } from './sales-invoice-details.controller';
import { SalesInvoiceDetailsService } from './sales-invoice-details.service';

describe('SalesInvoiceDetailsController', () => {
  let controller: SalesInvoiceDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesInvoiceDetailsController],
      providers: [SalesInvoiceDetailsService],
    }).compile();

    controller = module.get<SalesInvoiceDetailsController>(SalesInvoiceDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
