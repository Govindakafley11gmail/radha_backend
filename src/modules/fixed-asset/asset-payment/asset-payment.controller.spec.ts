import { Test, TestingModule } from '@nestjs/testing';
import { AssetPaymentController } from './asset-payment.controller';
import { AssetPaymentService } from './asset-payment.service';

describe('AssetPaymentController', () => {
  let controller: AssetPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetPaymentController],
      providers: [AssetPaymentService],
    }).compile();

    controller = module.get<AssetPaymentController>(AssetPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
