import { Test, TestingModule } from '@nestjs/testing';
import { SalaryslipService } from './salaryslip.service';

describe('SalaryslipService', () => {
  let service: SalaryslipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalaryslipService],
    }).compile();

    service = module.get<SalaryslipService>(SalaryslipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
