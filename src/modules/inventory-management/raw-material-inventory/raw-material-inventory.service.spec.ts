import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialInventoryService } from './raw-material-inventory.service';

describe('RawMaterialInventoryService', () => {
  let service: RawMaterialInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawMaterialInventoryService],
    }).compile();

    service = module.get<RawMaterialInventoryService>(RawMaterialInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
