import { Test, TestingModule } from '@nestjs/testing';
import { ProductUnitCostController } from './product-unit-cost.controller';
import { ProductUnitCostService } from './product-unit-cost.service';

describe('ProductUnitCostController', () => {
  let controller: ProductUnitCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductUnitCostController],
      providers: [ProductUnitCostService],
    }).compile();

    controller = module.get<ProductUnitCostController>(ProductUnitCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
