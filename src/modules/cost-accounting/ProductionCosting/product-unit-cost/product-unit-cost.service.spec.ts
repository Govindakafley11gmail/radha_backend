import { Test, TestingModule } from '@nestjs/testing';
import { ProductUnitCostService } from './product-unit-cost.service';

describe('ProductUnitCostService', () => {
  let service: ProductUnitCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductUnitCostService],
    }).compile();

    service = module.get<ProductUnitCostService>(ProductUnitCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
