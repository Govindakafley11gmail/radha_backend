import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialInventoryController } from './raw-material-inventory.controller';
import { RawMaterialInventoryService } from './raw-material-inventory.service';

describe('RawMaterialInventoryController', () => {
  let controller: RawMaterialInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawMaterialInventoryController],
      providers: [RawMaterialInventoryService],
    }).compile();

    controller = module.get<RawMaterialInventoryController>(RawMaterialInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
