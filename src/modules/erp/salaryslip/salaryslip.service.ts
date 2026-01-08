import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSalaryslipDto } from './dto/update-salaryslip.dto';
import { SalarySlip } from './entities/salaryslip.entity';

@Injectable()
export class SalaryslipService {
  constructor(
    @InjectRepository(SalarySlip)
    private readonly salarySlipRepo: Repository<SalarySlip>,
  ) {}


  /* ---------------- GET ALL ---------------- */
  async findAll(userId: number): Promise<SalarySlip[]> {
const slips = await this.salarySlipRepo.find({
    where: { employeeId: userId },
    relations: ['employee', 'payroll'], // optional: fetch related Payroll & User info
    order: { generatedAt: 'DESC' }, // latest first
  });

  return slips; 
 }

  /* ---------------- GET BY ID ---------------- */
  async findOne(id: string): Promise<SalarySlip> {
    const slip = await this.salarySlipRepo.findOne({ where: { id } });
    if (!slip) throw new NotFoundException('Salary slip not found');
    return slip;
  }

  /* ---------------- UPDATE ---------------- */
  async update(
    id: string,
    updateSalaryslipDto: UpdateSalaryslipDto,
  ): Promise<SalarySlip> {
    const slip = await this.findOne(id);
    Object.assign(slip, updateSalaryslipDto);
    return this.salarySlipRepo.save(slip);
  }


  /* ---------------- UTILITY: BY PAYROLL ---------------- */
  async findByPayroll(payrollId: string): Promise<SalarySlip[]> {
    return this.salarySlipRepo.find({
      where: { payrollId },
    });
  }


}
