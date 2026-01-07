import { Test, TestingModule } from '@nestjs/testing';
import { LeaveEncashmentpaymentController } from './leave-encashmentpayment.controller';
import { LeaveEncashmentpaymentService } from './leave-encashmentpayment.service';

describe('LeaveEncashmentpaymentController', () => {
  let controller: LeaveEncashmentpaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveEncashmentpaymentController],
      providers: [LeaveEncashmentpaymentService],
    }).compile();

    controller = module.get<LeaveEncashmentpaymentController>(LeaveEncashmentpaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
