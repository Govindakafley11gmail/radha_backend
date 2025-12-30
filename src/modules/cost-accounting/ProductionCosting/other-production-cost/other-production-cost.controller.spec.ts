import { Test, TestingModule } from '@nestjs/testing';
import { OtherProductionCostController } from './other-production-cost.controller';
import { OtherProductionCostService } from './other-production-cost.service';

describe('OtherProductionCostController', () => {
  let controller: OtherProductionCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtherProductionCostController],
      providers: [OtherProductionCostService],
    }).compile();

    controller = module.get<OtherProductionCostController>(OtherProductionCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
