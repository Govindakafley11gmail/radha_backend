import { Test, TestingModule } from '@nestjs/testing';
import { PayrollPaymentController } from './payroll-payment.controller';
import { PayrollPaymentService } from './payroll-payment.service';

describe('PayrollPaymentController', () => {
  let controller: PayrollPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollPaymentController],
      providers: [PayrollPaymentService],
    }).compile();

    controller = module.get<PayrollPaymentController>(PayrollPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
