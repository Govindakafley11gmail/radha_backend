/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { SalarySlip } from '../salaryslip/entities/salaryslip.entity';

// import { SalarySlip } from '../salary-slip/entities/salary-slip.entity';

@Injectable()
export class PayrollService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,

    @InjectRepository(PayrollDetail)
    private readonly payrollDetailRepo: Repository<PayrollDetail>,

    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>,

    // @InjectRepository(SalarySlip)
    // private readonly salarySlipRepo: Repository<SalarySlip>,
  ) { }

  /* ---------------- CREATE PAYROLL (UNCHANGED) ---------------- */

  async create(dto: CreatePayrollDto): Promise<Payroll> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payroll = queryRunner.manager.create(Payroll, {
        month:dto.month,
        year: dto.year,
        totalAmount: dto.totalAmount,
        totalAllowance: dto.totalAllowance,
        totalDeduction: dto.totalDeduction,
        payrollDate: new Date(dto.payrollDate),
        status: PayrollStatus.DRAFT,
        remarks: dto.remarks
      });

      const savedPayroll = await queryRunner.manager.save(payroll);

      const details: PayrollDetail[] = [];

      for (const emp of dto.employees) {
        const allowances =
          Number(emp.housingAllowance) + Number(emp.otherAllowance);
        const providentFund =
          (Number(emp.basicSalary) * Number(emp.providentInterest)) / 100;
        const deductions =
          providentFund + Number(emp.tds) + Number(emp.medical);

        const netSalary =
          Number(emp.basicSalary) + allowances - deductions;
        const detail = queryRunner.manager.create(PayrollDetail, {
          payroll: savedPayroll,
          payrollId: savedPayroll.id,
          employeeId: emp.employeeId,
          basicSalary: emp.basicSalary,
          housingAllowance: emp.housingAllowance,
          otherAllowance: emp.otherAllowance,
          tds: emp.tds,
          providentInterest: emp.providentInterest,
          medical: emp.medical,
          allowances: allowances,
          providentFund,
          deductions: deductions,
          netSalary,
        });

        details.push(detail);
      }
        console.log('Net Salary for employee', details);

      await queryRunner.manager.save(details);

      savedPayroll.totalAmount = details.reduce(
        (sum, d) => sum + Number(d.netSalary),
        0,
      );

      savedPayroll.details = details;
      await queryRunner.manager.save(savedPayroll);

      await queryRunner.commitTransaction();
      return savedPayroll;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  /* ---------------- APPROVAL FLOW (UPDATED) ---------------- */

  async approve(
    id: string,
    userId: number,
  ): Promise<Payroll> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payroll = await queryRunner.manager.findOne(Payroll, {
        where: { id },
        relations: ['details'],
      });

      if (!payroll) throw new NotFoundException('Payroll not found');
      if (payroll.status !== PayrollStatus.PENDING) {
        throw new BadRequestException('Only PENDING payrolls can be approved');
      }

      /* 1️⃣ Approve Payroll */
      payroll.status = PayrollStatus.APPROVED;
      payroll.approvedBy = userId;
      payroll.approvedAt = new Date();
      const savedPayroll = await queryRunner.manager.save(payroll);

      /* 2️⃣ Post Accounting */
      await this.postPayrollAccounting(queryRunner, savedPayroll, userId);

      /* 3️⃣ Generate Salary Slips */
      await this.generateSalarySlips(queryRunner, savedPayroll);

      await queryRunner.commitTransaction();
      return savedPayroll;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  /* ---------------- ACCOUNTING POSTING ---------------- */

  private async postPayrollAccounting(
    queryRunner,
    payroll: Payroll,
    userId: number,
  ) {
    const transaction = queryRunner.manager.create(AccountTransaction, {
      accountId: payroll.id,
      referenceType: 'PAYROLL',
      referenceId: payroll.id,
      voucher_no: `RADHA/${new Date().getFullYear()}/PAY/${Date.now()}`,
      voucher_amount: payroll.totalAmount,
      description: `Payroll for ${payroll.payrollDate}`,
      transactionDate: payroll.payrollDate,
      createdBy: userId,
    });

    const savedTransaction = await queryRunner.manager.save(transaction);

    let netSalary = 0;
    let pf = 0;
    let deductions = 0;

    for (const d of payroll.details) {
      netSalary += Number(d.netSalary);
      pf += Number(d.providentFund);
      deductions += Number(d.deductions);
    }

    const accountTypes = await this.accountTypeRepository.find({
      where: [
        { name: 'Salary Expense' },
        { name: 'Provident Fund Payable' },
        { name: 'TDS Payable' },
        { name: 'Bank' },
      ],
      relations: ['group'],
    });

    const map = {};
    accountTypes.forEach(a => {
      map[a.name] = { id: a.id, groupId: a.group?.id };
    });

    const gl = [
      { code: 'SALARY_EXPENSE', dr: payroll.totalAmount, cr: 0, name: 'Salary Expense' },
      { code: 'PF_PAYABLE', dr: 0, cr: pf, name: 'Provident Fund Payable' },
      { code: 'TDS_PAYABLE', dr: 0, cr: deductions, name: 'TDS Payable' },
      { code: 'BANK', dr: 0, cr: netSalary, name: 'Bank' },
    ];

    const details: AccountTransactionDetail[] = [];

    for (const g of gl) {
      if (!g.dr && !g.cr) continue;

      details.push(
        queryRunner.manager.create(AccountTransactionDetail, {
          transaction: savedTransaction,
          accountId: payroll.id,
          accountGroup: map[g.name]?.groupId
            ? { id: map[g.name].groupId }
            : undefined,
          accountType: map[g.name]?.id
            ? { id: map[g.name].id }
            : undefined,
          accountCode: g.code,
          debit: g.dr,
          credit: g.cr,
          description: g.name,
        }),
      );
    }

    await queryRunner.manager.save(details);
  }

  /* ---------------- SALARY SLIP GENERATION ---------------- */

  private async generateSalarySlips(queryRunner, payroll: Payroll) {
    const slips: SalarySlip[] = [];

    for (const d of payroll.details) {
      slips.push(
        queryRunner.manager.create(SalarySlip, {
          payrollId: payroll.id,
          employeeId: d.employeeId,
          basicSalary: d.basicSalary,
          allowances:
            Number(d.housingAllowance) + Number(d.otherAllowance),
          deductions: d.deductions,
          netSalary: d.netSalary,
          generatedAt: new Date(),
        }),
      );
    }

    await queryRunner.manager.save(slips);
  }

  /* ---------------- OTHERS (UNCHANGED) ---------------- */

  async submitForApproval(id: string): Promise<Payroll> {
    const payroll = await this.findOne(id);
    if (payroll.status !== PayrollStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT payrolls can be submitted');
    }
    payroll.status = PayrollStatus.PENDING;
    return this.payrollRepo.save(payroll);
  }

  async reject(id: string, approverId: number, remarks: string): Promise<Payroll> {
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

  async findOne(id: string): Promise<Payroll> {
    const payroll = await this.payrollRepo.findOne({
      where: { id },
      relations: ['details'],
    });
    if (!payroll) throw new NotFoundException('Payroll not found');
    return payroll;
  }
  async findAll(): Promise<Payroll[]> {
    const payroll = await this.payrollRepo.find({
      where: { status: PayrollStatus.DRAFT }, // ✅ only DRAFT payrolls
      relations: ['details', 'details.employee',
      ]
    });
    return payroll;
  }
}
