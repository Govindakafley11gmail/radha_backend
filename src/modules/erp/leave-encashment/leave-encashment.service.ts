/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  QueryRunner,
} from 'typeorm';

import { LeaveEncashment, EncashmentStatus } from './entities/leave-encashment.entity';
import { CreateLeaveEncashmentDto } from './dto/create-leave-encashment.dto';
import { UpdateLeaveEncashmentDto } from './dto/update-leave-encashment.dto';

import { User } from 'src/modules/authentication/users/entities/user.entity';
import { LeaveType } from '../leave-types/entities/leave-type.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { Dispatch } from 'src/modules/public/dispatch/entities/dispatch.entity';



@Injectable()
export class LeaveEncashmentService {
  constructor(
    @InjectRepository(LeaveEncashment)
    private readonly encashmentRepo: Repository<LeaveEncashment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(LeaveType)
    private readonly leaveTypeRepo: Repository<LeaveType>,

    @InjectRepository(AccountTransaction)
    private readonly accountTransactionRepo: Repository<AccountTransaction>,

    @InjectRepository(AccountTransactionDetail)
    private readonly accountTransactionDetailRepo: Repository<AccountTransactionDetail>,

    @InjectRepository(AccountType)
    private readonly accountTypeRepo: Repository<AccountType>,
  ) { }

  // ==========================================================
  // CREATE
  // ==========================================================
  async create(
    employeeId: number,
    dto: CreateLeaveEncashmentDto,
  ): Promise<LeaveEncashment> {
    const employee = await this.userRepo.findOne({ where: { id: employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');

    const leaveType = await this.leaveTypeRepo.findOne({
      where: { id: dto.leaveTypeId },
    });
    if (!leaveType) throw new NotFoundException('Leave type not found');

    const encashment = this.encashmentRepo.create({
      employee,
      leaveTypeId: dto.leaveTypeId,
      days: dto.days,
      amount: dto.amount,
      status: 'PENDING' as EncashmentStatus,
      created_at: new Date(),
    });

    return this.encashmentRepo.save(encashment);
  }

  // ==========================================================
  // FIND ALL (EMPLOYEE)
  // ==========================================================
  async findAll(employeeId: number): Promise<LeaveEncashment[]> {
    return this.encashmentRepo.find({
      where: { employee: { id: employeeId } },
      relations: ['employee'],
    });
  }

  // ==========================================================
  // FIND ONE
  // ==========================================================
  async findOne(
    employeeId: number,
    id: string,
  ): Promise<LeaveEncashment> {
    const encashment = await this.encashmentRepo.findOne({
      where: { id, employee: { id: employeeId } },
      relations: ['employee'],
    });

    if (!encashment) {
      throw new NotFoundException(
        'Leave encashment not found or access denied',
      );
    }

    return encashment;
  }

  // ==========================================================
  // UPDATE (APPROVAL → ACCOUNT POSTING)
  // ==========================================================
  async update(
    employeeId: number,
    id: string,
    dto: UpdateLeaveEncashmentDto,
    userRole: string,
  ): Promise<LeaveEncashment> {
    const encashment = await this.encashmentRepo.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!encashment) {
      throw new NotFoundException('Leave encashment not found');
    }

    if (!['HR', 'Manager'].includes(userRole)) {
      throw new ForbiddenException(
        'You are not allowed to update this encashment',
      );
    }

    if (encashment.status === EncashmentStatus.APPROVED) {
      throw new ForbiddenException(
        'This encashment is already approved',
      );
    }

    if (!dto.status) return encashment;

    const queryRunner = this.encashmentRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      encashment.status = dto.status;
      encashment.approvedBy = employeeId;

      if (dto.status === EncashmentStatus.APPROVED) {
        await this.postToAccounts(queryRunner, encashment, employeeId);
      }

      const saved = await queryRunner.manager.save(encashment);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ==========================================================
  // ACCOUNTING POSTING (GL)
  // ==========================================================
  private async postToAccounts(
    queryRunner: QueryRunner,
    encashment: LeaveEncashment,
    userId: number,
  ) {
    const amount = encashment.amount;
      const lastDispatch = await queryRunner.manager
        .createQueryBuilder(Dispatch, 'dispatch')
        .orderBy('dispatch.versionNo', 'DESC')
        .getOne();

      const versionNo = lastDispatch ? lastDispatch.versionNo + 1 : 1;

      // 2️⃣ Generate dispatchNo
      const dispatchNo = `RADHA/${new Date().getFullYear()}/Leave/${String(versionNo).padStart(4, '0')}`;

      // 3️⃣ Create dispatch entity
      const dispatchEntity = queryRunner.manager.create(Dispatch, {
        dispatchDate: new Date().getDate(),
        remarks: `Dispatch for Leave Encashment`,
        versionNo,    // ✅ required
        dispatchNo,   // ✅ required
      });

      // 4️ Save in the same transaction
      await queryRunner.manager.save(dispatchEntity);
    // 6️⃣ TRANSACTION HEADER
    const transaction = queryRunner.manager.create(AccountTransaction, {
      referenceType: 'LEAVE_ENCASHMENT',
      referenceId: encashment.id,
      voucher_no: dispatchNo,
      voucher_amount: encashment.amount,
      description: 'Leave Encashment Approval',
      transactionDate: encashment.created_at,
      createdBy: userId,
      // updatedBy: userId,
    });

    const savedTransaction = await queryRunner.manager.save(transaction);


    // 7️⃣ ACCOUNT TYPES
    const accountTypes = await queryRunner.manager.find(AccountType, {
      where: [
        { name: 'Leave Encashment Expense' },
        { name: 'Employee Payable' },
      ],
      relations: ['group'],
    });

    const accountMap: Record<string, { id: string; groupId?: string }> = {};
    accountTypes.forEach(acc => {
      accountMap[acc.name] = {
        id: acc.id,
        groupId: acc.group?.id,
      };
    });

    // 8️⃣ GL MAPPINGS
    const glMappings = [
      {
        accountCode: 'LEAVE_EXPENSE',
        debit: amount,
        credit: 0,
        description: 'Leave Encashment Expense',
        groupId: accountMap['Leave Encashment Expense']?.groupId,
        accountTypeID: accountMap['Leave Encashment Expense']?.id,
      },
      {
        accountCode: 'EMPLOYEE_PAYABLE',
        debit: 0,
        credit: amount,
        description: 'Employee Payable – Leave Encashment',
        groupId: accountMap['Employee Payable']?.groupId,
        accountTypeID: accountMap['Employee Payable']?.id,
      },
    ];

    // 9️⃣ TRANSACTION DETAILS
    const details: AccountTransactionDetail[] = [];

    for (const line of glMappings) {
      const detail = queryRunner.manager.create(AccountTransactionDetail, {
        transaction: savedTransaction,
        accountGroup: line.groupId ? { id: line.groupId } : undefined,
        accountType: line.accountTypeID
          ? { id: line.accountTypeID }
          : undefined,
        accountCode: line.accountCode,
        debit: line.debit,
        credit: line.credit,
        description: line.description,
      });

      details.push(detail);
    }

    await queryRunner.manager.save(details);
  }

  // ==========================================================
  // DELETE
  // ==========================================================
  async remove(
    employeeId: number,
    id: string,
  ): Promise<{ message: string }> {
    const encashment = await this.findOne(employeeId, id);
    await this.encashmentRepo.remove(encashment);
    return { message: 'Leave encashment deleted successfully' };
  }
}
