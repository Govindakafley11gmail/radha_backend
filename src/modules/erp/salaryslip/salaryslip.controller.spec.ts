import { Test, TestingModule } from '@nestjs/testing';
import { SalaryslipController } from './salaryslip.controller';
import { SalaryslipService } from './salaryslip.service';

describe('SalaryslipController', () => {
  let controller: SalaryslipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryslipController],
      providers: [SalaryslipService],
    }).compile();

    controller = module.get<SalaryslipController>(SalaryslipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
