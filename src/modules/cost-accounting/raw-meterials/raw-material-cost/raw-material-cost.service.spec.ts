import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialCostService } from './raw-material-cost.service';

describe('RawMaterialCostService', () => {
  let service: RawMaterialCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawMaterialCostService],
    }).compile();

    service = module.get<RawMaterialCostService>(RawMaterialCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
