import { Test, TestingModule } from '@nestjs/testing';
import { FinishedGoodsInventoryService } from './finished-goods-inventory.service';

describe('FinishedGoodsInventoryService', () => {
  let service: FinishedGoodsInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinishedGoodsInventoryService],
    }).compile();

    service = module.get<FinishedGoodsInventoryService>(FinishedGoodsInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
