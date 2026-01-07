import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { Payroll, PayrollStatus } from './entities/payroll.entity';
import { PayrollDetail } from '../payroll-details/entities/payroll-detail.entity';

@Injectable()
export class PayrollService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,

    @InjectRepository(PayrollDetail)
    private readonly payrollDetailRepo: Repository<PayrollDetail>,

  ) {}

  async create(dto: CreatePayrollDto): Promise<Payroll> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // -------------------------
      // 1. Create Payroll (Header)
      // -------------------------
      const payroll = queryRunner.manager.create(Payroll, {
        payrollDate: new Date(dto.payrollDate),
        status: PayrollStatus.DRAFT,
        totalAmount: 0,
      });

      const savedPayroll = await queryRunner.manager.save(payroll);

      // -------------------------
      // 2. Create Payroll Details
      // -------------------------
      const details: PayrollDetail[] = [];

      for (const emp of dto.employees) {
        const basicSalary = Number(emp.basicSalary);
        const housingAllowance = Number(emp.housingAllowance);
        const otherAllowance = Number(emp.otherAllowance);
        const tds = Number(emp.tds);
        const medical = Number(emp.medical);
        const providentInterest = Number(emp.providentInterest);

        const allowances = housingAllowance + otherAllowance;
        const providentFund = (basicSalary * providentInterest) / 100;
        const deductions = providentFund + tds + medical;
        const netSalary = basicSalary + allowances - deductions;

        const detail = queryRunner.manager.create(PayrollDetail, {
          payroll: savedPayroll,
          payrollId: savedPayroll.id,
          employeeId: emp.employeeId,
          basicSalary,
          housingAllowance,
          otherAllowance,
          providentFund,
          deductions,
          netSalary,
        });

        details.push(detail);
      }

      await queryRunner.manager.save(details);

      // -------------------------
      // 3. Update Payroll Totals
      // -------------------------
      savedPayroll.totalAmount = details.reduce(
        (sum, d) => sum + Number(d.netSalary),
        0,
      );

      savedPayroll.details = details;

      await queryRunner.manager.save(savedPayroll);

      // -------------------------
      // 4. Commit Transaction
      // -------------------------
      await queryRunner.commitTransaction();

      return savedPayroll;
    } catch (error) {
      // -------------------------
      // Rollback on Error
      // -------------------------
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // -------------------------
      // Release QueryRunner
      // -------------------------
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Payroll[]> {
    return this.payrollRepo.find({ relations: ['details','employee'] });
  }


  async findOne(id: string): Promise<Payroll> {
    const payroll = await this.payrollRepo.findOne({
      where: { id },
      relations: ['details'],
    });

    if (!payroll) throw new NotFoundException('Payroll not found');
    return payroll;
  }

  async submitForApproval(id: string): Promise<Payroll> {
    const payroll = await this.findOne(id);

    if (payroll.status !== PayrollStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT payrolls can be submitted');
    }

    payroll.status = PayrollStatus.PENDING;
    return this.payrollRepo.save(payroll);
  }

  async approve(id: string, approverId: number): Promise<Payroll> {
    const payroll = await this.findOne(id);

    if (payroll.status !== PayrollStatus.PENDING) {
      throw new BadRequestException('Only PENDING payrolls can be approved');
    }

    payroll.status = PayrollStatus.APPROVED;
    payroll.approvedBy = approverId;
    payroll.approvedAt = new Date();

    return this.payrollRepo.save(payroll);
  }

  async reject(
    id: string,
    approverId: number,
    remarks: string,
  ): Promise<Payroll> {
    const payroll = await this.findOne(id);

    if (payroll.status !== PayrollStatus.PENDING) {
      throw new BadRequestException('Only PENDING payrolls can be rejected');
    }

    payroll.status = PayrollStatus.REJECTED;
    payroll.approvedBy = approverId;
    payroll.approvedAt = new Date();
    payroll.remarks = remarks;

    return this.payrollRepo.save(payroll);
  }
}
