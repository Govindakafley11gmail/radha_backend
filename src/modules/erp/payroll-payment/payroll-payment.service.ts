/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { PayrollPayment } from './entities/payroll-payment.entity';
import { Payroll, PayrollStatus } from '../payroll/entities/payroll.entity';

import { CreatePayrollPaymentDto } from './dto/create-payroll-payment.dto';
import { UpdatePayrollPaymentDto } from './dto/update-payroll-payment.dto';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';



@Injectable()
export class PayrollPaymentService {
  constructor(
    @InjectRepository(PayrollPayment)
    private paymentRepo: Repository<PayrollPayment>,

    @InjectRepository(Payroll)
    private payrollRepo: Repository<Payroll>,

    @InjectRepository(AccountType)
    private accountTypeRepo: Repository<AccountType>,

    private dataSource: DataSource,
  ) { }

  async create(dto: CreatePayrollPaymentDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Find Payroll
      const payroll = await this.payrollRepo.findOne({
        where: { id: dto.id },
      });

      if (!payroll) {
        throw new NotFoundException('Payroll not found');
      }
      console.log("payrollpayment", payroll.totalAmount);

      // 2️⃣ Create Payment
      const payment = this.paymentRepo.create({
        remarks: dto.remarks,
        date: dto.paymentDate,
        chequeNo: dto.chequeNo,
        amount: Number(payroll.totalAmount),
        status: 'PAID',
        payroll: payroll,
        paymentMethod: dto.paymentMethod,
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // 3️⃣ Create Account Transaction
      const transaction = queryRunner.manager.create(AccountTransaction, {
        accountId: payroll.id,
        referenceType: 'PAYROLL',
        referenceId: payroll.id,
        voucher_no: `PAY/${new Date().getFullYear()}/${Date.now()}`,
        voucher_amount: Number(payroll.totalAmount),
        description: `Payroll Payment`,
        transactionDate: dto.paymentDate,
        createdBy: 1,
      });

      const savedTransaction = await queryRunner.manager.save(transaction);
     payroll.status = PayrollStatus.PAID;
      await queryRunner.manager.save(payroll);
      // 4️⃣ Get Account Types
      const accountTypes = await this.accountTypeRepo.find({
        where: [
          { name: 'Salary Expense' },
          { name: 'Cash' },
          { name: 'Bank' },
        ],
        relations: ['group'],
      });

      const accountMap: Record<string, any> = {};
      accountTypes.forEach(acc => {
        accountMap[acc.name] = {
          id: acc.id,
          groupId: acc.group?.id,
        };
      });

      // 5️⃣ GL Entries (DOUBLE ENTRY)
      const glMappings = [
        {
          account: 'Salary Expense',
          debit: Number(payroll.totalAmount),
          credit: 0,
        },
        {
          account:
            dto.paymentMethod === 'CASH' ? 'Cash' : 'Bank',
          debit: 0,
          credit: Number(payroll.totalAmount),
        },
      ];

      const details = glMappings.map(line =>
        queryRunner.manager.create(AccountTransactionDetail, {
          accountId: savedTransaction.id,
          accountCode: line.account,



          transaction: { id: savedTransaction.id },
          accountType: { id: accountMap[line.account]?.id },
          accountGroup: accountMap[line.account]?.groupId
            ? { id: accountMap[line.account]?.groupId }
            : undefined,
          debit: line.debit,
          credit: line.credit,
          description: `Payroll Payment`,
        }),
      );

      await queryRunner.manager.save(details);
 
      // 6️⃣ Commit
      await queryRunner.commitTransaction();

      return savedPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.paymentRepo.find({
      relations: ['payroll'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['payroll'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(id: string, dto: UpdatePayrollPaymentDto) {
    const payment = await this.findOne(id);

    if (dto.id) {
      const payroll = await this.payrollRepo.findOne({
        where: { id: dto.id },
      });

      if (!payroll) {
        throw new NotFoundException('Payroll not found');
      }

      payment.payroll = payroll;
    }

    return this.paymentRepo.save(payment);
  }

  async remove(id: string) {
    const payment = await this.findOne(id);
    return this.paymentRepo.remove(payment);
  }
}