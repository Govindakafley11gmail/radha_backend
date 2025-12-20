import { Test, TestingModule } from '@nestjs/testing';
import { ApAgingService } from './ap_aging.service';

describe('ApAgingService', () => {
  let service: ApAgingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApAgingService],
    }).compile();

    service = module.get<ApAgingService>(ApAgingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
