import { Test, TestingModule } from '@nestjs/testing';
import { RawMaterialReceiptController } from './raw-material-receipt.controller';
import { RawMaterialReceiptService } from './raw-material-receipt.service';

describe('RawMaterialReceiptController', () => {
  let controller: RawMaterialReceiptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawMaterialReceiptController],
      providers: [RawMaterialReceiptService],
    }).compile();

    controller = module.get<RawMaterialReceiptController>(RawMaterialReceiptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
