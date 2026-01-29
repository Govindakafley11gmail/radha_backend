import { Test, TestingModule } from '@nestjs/testing';
import { AssetPaymentService } from './asset-payment.service';

describe('AssetPaymentService', () => {
  let service: AssetPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetPaymentService],
    }).compile();

    service = module.get<AssetPaymentService>(AssetPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
