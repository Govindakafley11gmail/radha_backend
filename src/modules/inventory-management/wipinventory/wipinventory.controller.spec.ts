import { Test, TestingModule } from '@nestjs/testing';
import { WipinventoryController } from './wipinventory.controller';
import { WipinventoryService } from './wipinventory.service';

describe('WipinventoryController', () => {
  let controller: WipinventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WipinventoryController],
      providers: [WipinventoryService],
    }).compile();

    controller = module.get<WipinventoryController>(WipinventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
