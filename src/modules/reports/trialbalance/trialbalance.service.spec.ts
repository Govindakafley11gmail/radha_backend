import { Test, TestingModule } from '@nestjs/testing';
import { TrialbalanceService } from './trialbalance.service';

describe('TrialbalanceService', () => {
  let service: TrialbalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrialbalanceService],
    }).compile();

    service = module.get<TrialbalanceService>(TrialbalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
