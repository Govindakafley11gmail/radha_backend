import { Test, TestingModule } from '@nestjs/testing';
import { LeaveEncashmentpaymentService } from './leave-encashmentpayment.service';

describe('LeaveEncashmentpaymentService', () => {
  let service: LeaveEncashmentpaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveEncashmentpaymentService],
    }).compile();

    service = module.get<LeaveEncashmentpaymentService>(LeaveEncashmentpaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
