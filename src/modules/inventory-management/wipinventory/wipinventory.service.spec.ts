import { Test, TestingModule } from '@nestjs/testing';
import { WipinventoryService } from './wipinventory.service';

describe('WipinventoryService', () => {
  let service: WipinventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WipinventoryService],
    }).compile();

    service = module.get<WipinventoryService>(WipinventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
