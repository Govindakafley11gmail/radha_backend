import { Test, TestingModule } from '@nestjs/testing';
import { LaborCostController } from './labor-cost.controller';
import { LaborCostService } from './labor-cost.service';

describe('LaborCostController', () => {
  let controller: LaborCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaborCostController],
      providers: [LaborCostService],
    }).compile();

    controller = module.get<LaborCostController>(LaborCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
