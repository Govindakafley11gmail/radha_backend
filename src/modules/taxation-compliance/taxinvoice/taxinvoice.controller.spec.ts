import { Test, TestingModule } from '@nestjs/testing';
import { TaxinvoiceController } from './taxinvoice.controller';
import { TaxinvoiceService } from './taxinvoice.service';

describe('TaxinvoiceController', () => {
  let controller: TaxinvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxinvoiceController],
      providers: [TaxinvoiceService],
    }).compile();

    controller = module.get<TaxinvoiceController>(TaxinvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
