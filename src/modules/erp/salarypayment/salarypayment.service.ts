import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SalaryPayment, PaymentStatus } from './entities/salarypayment.entity';
import { CreateSalarypaymentDto } from './dto/create-salarypayment.dto';
import { UpdateSalarypaymentDto } from './dto/update-salarypayment.dto';
import { Payroll } from '../payroll/entities/payroll.entity';
import { SalarySlip } from '../salaryslip/entities/salaryslip.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';

@Injectable()
export class SalarypaymentService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(SalaryPayment)
    private readonly salaryPaymentRepo: Repository<SalaryPayment>,

    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,

    @InjectRepository(SalarySlip)
    private readonly salarySlipRepo: Repository<SalarySlip>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ---------------- CREATE PAYMENT ----------------
  async create(createDto: CreateSalarypaymentDto): Promise<SalaryPayment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ Find Payroll
      const payroll = await queryRunner.manager.findOne(Payroll, {
        where: { id: createDto.payrollId },
      });
      if (!payroll) throw new NotFoundException('Payroll not found');

      // ✅ Find SalarySlip
      const salarySlip = await queryRunner.manager.findOne(SalarySlip, {
        where: { id: createDto.salarySlipId },
      });
      if (!salarySlip) throw new NotFoundException('Salary slip not found');

      // ✅ Find Employee
      const employee = await queryRunner.manager.findOne(User, {
        where: { id: createDto.employeeId },
      });
      if (!employee) throw new NotFoundException('Employee not found');

      // ✅ Create SalaryPayment
      const payment = queryRunner.manager.create(SalaryPayment, {
        payroll,
        payrollId: payroll.id,
        salarySlip,
        salarySlipId: salarySlip.id,
        employee,
        // employeeId: employee.id,
        amount: createDto.amount,
        paymentDate: createDto.paymentDate,
        paymentMode: createDto.paymentMode,
        referenceNo: createDto.referenceNo,
        status: PaymentStatus.PENDING,
      });

      const savedPayment = await queryRunner.manager.save(payment);

      await queryRunner.commitTransaction();
      return savedPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ---------------- GET ALL ----------------
  async findAll(): Promise<SalaryPayment[]> {
    return this.salaryPaymentRepo.find({
      relations: ['payroll', 'salarySlip', 'employee'],
    });
  }

  // ---------------- GET ONE ----------------
  async findOne(id: string): Promise<SalaryPayment> {
    const payment = await this.salaryPaymentRepo.findOne({
      where: { id },
      relations: ['payroll', 'salarySlip', 'employee'],
    });
    if (!payment) throw new NotFoundException('Salary payment not found');
    return payment;
  }

  // ---------------- UPDATE ----------------
  async update(id: string, updateDto: UpdateSalarypaymentDto): Promise<SalaryPayment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updateDto);
    return this.salaryPaymentRepo.save(payment);
  }

  // ---------------- DELETE ----------------
  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.salaryPaymentRepo.remove(payment);
  }

  // ---------------- FIND BY EMPLOYEE ----------------
  async findByEmployee(employeeId: string): Promise<SalaryPayment[]> {
    return this.salaryPaymentRepo.find({
      where: { employeeId },
      relations: ['payroll', 'salarySlip'],
    });
  }

  // ---------------- MARK AS PAID ----------------
  async markAsPaid(id: string, referenceNo?: string): Promise<SalaryPayment> {
    const payment = await this.findOne(id);
    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Payment is already marked as PAID');
    }

    payment.status = PaymentStatus.PAID;
    if (referenceNo) payment.referenceNo = referenceNo;

    return this.salaryPaymentRepo.save(payment);
  }
}
