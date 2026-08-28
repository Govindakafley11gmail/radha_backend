import { Test, TestingModule } from '@nestjs/testing';
import { PayrollPaymentService } from './payroll-payment.service';

describe('PayrollPaymentService', () => {
  let service: PayrollPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollPaymentService],
    }).compile();

    service = module.get<PayrollPaymentService>(PayrollPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
