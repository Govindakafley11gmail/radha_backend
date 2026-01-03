import { Test, TestingModule } from '@nestjs/testing';
import { FinishedGoodsInventoryController } from './finished-goods-inventory.controller';
import { FinishedGoodsInventoryService } from './finished-goods-inventory.service';

describe('FinishedGoodsInventoryController', () => {
  let controller: FinishedGoodsInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinishedGoodsInventoryController],
      providers: [FinishedGoodsInventoryService],
    }).compile();

    controller = module.get<FinishedGoodsInventoryController>(FinishedGoodsInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
