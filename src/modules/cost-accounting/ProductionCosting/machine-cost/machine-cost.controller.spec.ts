import { Test, TestingModule } from '@nestjs/testing';
import { MachineCostController } from './machine-cost.controller';
import { MachineCostService } from './machine-cost.service';

describe('MachineCostController', () => {
  let controller: MachineCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineCostController],
      providers: [MachineCostService],
    }).compile();

    controller = module.get<MachineCostController>(MachineCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
