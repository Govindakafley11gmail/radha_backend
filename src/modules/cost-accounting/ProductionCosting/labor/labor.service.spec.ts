import { Test, TestingModule } from '@nestjs/testing';
import { LaborService } from './labor.service';

describe('LaborService', () => {
  let service: LaborService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaborService],
    }).compile();

    service = module.get<LaborService>(LaborService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
