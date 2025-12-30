import { Test, TestingModule } from '@nestjs/testing';
import { MachineCostService } from './machine-cost.service';

describe('MachineCostService', () => {
  let service: MachineCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachineCostService],
    }).compile();

    service = module.get<MachineCostService>(MachineCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
