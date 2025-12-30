import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialReceiptService } from './raw-material-receipt.service';

describe('RawMaterialReceiptService', () => {
  let service: RawMaterialReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawMaterialReceiptService],
    }).compile();

    service = module.get<RawMaterialReceiptService>(RawMaterialReceiptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
