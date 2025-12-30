import { Test, TestingModule } from '@nestjs/testing';
import { OtherProductionCostService } from './other-production-cost.service';

describe('OtherProductionCostService', () => {
  let service: OtherProductionCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtherProductionCostService],
    }).compile();

    service = module.get<OtherProductionCostService>(OtherProductionCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
