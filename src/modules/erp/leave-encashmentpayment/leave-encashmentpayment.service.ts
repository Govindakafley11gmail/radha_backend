import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveEncashmentPayment, PaymentStatus } from './entities/leave-encashmentpayment.entity';
import { CreateLeaveEncashmentpaymentDto } from './dto/create-leave-encashmentpayment.dto';
import { UpdateLeaveEncashmentpaymentDto } from './dto/update-leave-encashmentpayment.dto';
import { LeaveEncashment } from '../leave-encashment/entities/leave-encashment.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';


@Injectable()
export class LeaveEncashmentpaymentService {
  constructor(
    @InjectRepository(LeaveEncashmentPayment)
    private readonly paymentRepo: Repository<LeaveEncashmentPayment>,

    @InjectRepository(LeaveEncashment)
    private readonly encashmentRepo: Repository<LeaveEncashment>,

    @InjectRepository(AccountTransaction)
    private readonly transactionRepo: Repository<AccountTransaction>,

    @InjectRepository(AccountTransactionDetail)
    private readonly transactionDetailRepo: Repository<AccountTransactionDetail>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(AccountType)
    private readonly accountTypeRepo: Repository<AccountType>,
  ) { }

  // ==========================================================
  // CREATE PAYMENT
  // ==========================================================
  async create(
    dto: CreateLeaveEncashmentpaymentDto,
    processedById: number,
  ): Promise<LeaveEncashmentPayment> {
    const encashment = await this.encashmentRepo.findOne({ where: { id: dto.leave_encashment_id } });
    if (!encashment) throw new NotFoundException('Leave Encashment request not found');

    const processedBy = await this.userRepo.findOne({ where: { id: processedById } });
    if (!processedBy) throw new NotFoundException('Processing user not found');

    const queryRunner = this.paymentRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Create Account Transaction (GL Posting)
      const transaction = queryRunner.manager.create(AccountTransaction, {
        referenceType: 'LEAVE_ENCASHMENT',
        referenceId: encashment.id,
        description: `Leave Encashment Payment for ${encashment.id}`,
        transactionDate: new Date(),
        total_amount: dto.amount,
        created_by_id: processedById,
      });
      const savedTransaction = await queryRunner.manager.save(transaction);

      // 2️⃣ Fetch Account Types
      const accountTypes = await queryRunner.manager.find(AccountType, {
        where: [{ name: 'Leave Encashment Expense' }, { name: 'Employee Payable' }],
      });

      const accountMap: Record<string, AccountType> = {};
      accountTypes.forEach(acc => (accountMap[acc.name] = acc));

      // 3️⃣ Create Transaction Details
      const debitDetail = queryRunner.manager.create(AccountTransactionDetail, {
        transaction: savedTransaction,
        accountType: accountMap['Leave Encashment Expense'],
        debit: dto.amount,
        credit: 0,
        description: 'Leave Encashment Expense',
        created_by_id: processedById,
      });

      const creditDetail = queryRunner.manager.create(AccountTransactionDetail, {
        transaction: savedTransaction,
        accountType: accountMap['Employee Payable'],
        debit: 0,
        credit: dto.amount,
        description: 'Employee Payable – Leave Encashment',
        created_by_id: processedById,
      });

      await queryRunner.manager.save([debitDetail, creditDetail]);

      // 4️⃣ Create Leave Encashment Payment
      const payment = queryRunner.manager.create(LeaveEncashmentPayment, {
        leave_encashment_id: encashment.id,
        amount: dto.amount,
        payment_date: dto.payment_date ? new Date(dto.payment_date) : new Date(),
        status: PaymentStatus.COMPLETED,
        processed_by_id: processedById,
        account_transaction_id: savedTransaction.id,
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

  // ==========================================================
  // FIND ALL PAYMENTS
  // ==========================================================
  async findAll(): Promise<LeaveEncashmentPayment[]> {
    return this.paymentRepo.find({
      relations: ['leaveEncashment', 'processedBy', 'accountTransaction'],
    });
  }

  // ==========================================================
  // FIND ONE PAYMENT
  // ==========================================================
  async findOne(id: string): Promise<LeaveEncashmentPayment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['leaveEncashment', 'processedBy', 'accountTransaction'],
    });
    if (!payment) throw new NotFoundException(`Payment with id ${id} not found`);
    return payment;
  }

  // ==========================================================
  // UPDATE PAYMENT (status or date)
  // ==========================================================
  async update(id: string, dto: UpdateLeaveEncashmentpaymentDto): Promise<LeaveEncashmentPayment> {
    const payment = await this.findOne(id);
    Object.assign(payment, dto);
    return this.paymentRepo.save(payment);
  }

  // ==========================================================
  // DELETE PAYMENT
  // ==========================================================
  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepo.remove(payment);
  }
}
