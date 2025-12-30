import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialCostController } from './raw-material-cost.controller';
import { RawMaterialCostService } from './raw-material-cost.service';

describe('RawMaterialCostController', () => {
  let controller: RawMaterialCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawMaterialCostController],
      providers: [RawMaterialCostService],
    }).compile();

    controller = module.get<RawMaterialCostController>(RawMaterialCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
