import { Test, TestingModule } from '@nestjs/testing';
import { ApAgingController } from './ap_aging.controller';
import { ApAgingService } from './ap_aging.service';

describe('ApAgingController', () => {
  let controller: ApAgingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApAgingController],
      providers: [ApAgingService],
    }).compile();

    controller = module.get<ApAgingController>(ApAgingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
