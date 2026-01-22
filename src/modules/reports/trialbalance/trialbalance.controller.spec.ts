import { Test, TestingModule } from '@nestjs/testing';
import { TrialbalanceController } from './trialbalance.controller';
import { TrialbalanceService } from './trialbalance.service';

describe('TrialbalanceController', () => {
  let controller: TrialbalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrialbalanceController],
      providers: [TrialbalanceService],
    }).compile();

    controller = module.get<TrialbalanceController>(TrialbalanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
