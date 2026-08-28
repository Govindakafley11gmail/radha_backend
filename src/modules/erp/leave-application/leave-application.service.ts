/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';

import {
  LeaveApplication,
  LeaveStatus,
} from './entities/leave-application.entity';

import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
import { LeaveType } from '../leave-types/entities/leave-type.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';

@Injectable()
export class LeaveApplicationService {
  constructor(
    @InjectRepository(LeaveApplication)
    private readonly leaveApplicationRepo: Repository<LeaveApplication>,

    @InjectRepository(User)
    private readonly employeeRepo: Repository<User>,

    @InjectRepository(LeaveType)
    private readonly leaveTypeRepo: Repository<LeaveType>,
  ) {}

  // ---------------- CREATE ----------------
  async create(employeeId: number, createDto: CreateLeaveApplicationDto) {
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const leaveType = await this.leaveTypeRepo.findOne({
      where: { id: createDto.leaveTypeId },
    });

    if (!leaveType) throw new NotFoundException('Leave type not found');

    const leave = this.leaveApplicationRepo.create({
      employee,
      leaveType,
      ...createDto,
      status: LeaveStatus.PENDING,
      created_by: employeeId,
    });

    return this.leaveApplicationRepo.save(leave);
  }

  // ---------------- YEAR RANGE ----------------
  private getCurrentYearRange(): [string, string] {
    const now = new Date();

    return [
      new Date(now.getFullYear(), 0, 1).toISOString(),
      new Date(now.getFullYear(), 11, 31).toISOString(),
    ];
  }

  // ---------------- FIND ALL ----------------
  async findAll(employeeId: number) {
    const [start, end] = this.getCurrentYearRange();

    return this.leaveApplicationRepo.find({
      where: {
        employee: { id: employeeId },
        start_date: Between(start, end),
      },
      relations: ['employee', 'leaveType'],
    });
  }

  // ---------------- BALANCE ----------------
  async leavesBalance(employeeId: number) {
    const leaveTypes = await this.leaveTypeRepo.find();
    const [start, end] = this.getCurrentYearRange();

    const approved = await this.leaveApplicationRepo.find({
      where: {
        employee: { id: employeeId },
        status: LeaveStatus.APPROVED,
        start_date: Between(start, end),
      },
      relations: ['leaveType'],
    });

    const usedMap: Record<string, number> = {};

    approved.forEach((l) => {
      usedMap[l.leaveType.id] =
        (usedMap[l.leaveType.id] || 0) + l.total_days;
    });

    return leaveTypes.map((t) => ({
      leaveTypeId: t.id,
      leaveTypeName: t.name,
      max_days: t.max_days,
      used_days: usedMap[t.id] || 0,
      remaining_days: t.max_days - (usedMap[t.id] || 0),
    }));
  }

  // ---------------- FIND ONE ----------------
  async findOne(employeeId: number, id: string) {
    const [start, end] = this.getCurrentYearRange();

    const leave = await this.leaveApplicationRepo.findOne({
      where: {
        id,
        employee: { id: employeeId },
        start_date: Between(start, end),
      },
      relations: ['employee', 'leaveType'],
    });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    return leave;
  }

  // ---------------- UPDATE ----------------
  async update(
    employeeId: number,
    id: string,
    updateDto: UpdateLeaveApplicationDto,
    userRole: any[],
  ) {
    const leave = await this.leaveApplicationRepo.findOne({
      where: { id },
      relations: ['employee', 'leaveType'],
    });

    if (!leave) throw new NotFoundException('Leave not found');

    const roleNames = userRole?.map((r) => r.name) || [];

    const isAdmin = roleNames.some((r) =>
      ['HR', 'Manager', 'Admin'].includes(r),
    );

    if (!isAdmin) {
      if (leave.employee.id !== employeeId) {
        throw new ForbiddenException('Not allowed');
      }

      Object.assign(leave, updateDto);
      leave.status = LeaveStatus.PENDING;
    } else {
      Object.assign(leave, updateDto);

      if (updateDto.status) {
        leave.approved_by = employeeId;
      }
    }

    return this.leaveApplicationRepo.save(leave);
  }

  // ---------------- DELETE ----------------
  async remove(employeeId: number, id: string) {
    const leave = await this.findOne(employeeId, id);

    await this.leaveApplicationRepo.remove(leave);

    return { message: 'Deleted successfully' };
  }

  // =====================================================
  // 🔥 YEAR END CRON JOB (FIXED)
  // =====================================================
@Cron('* * * * *')
  async handleYearEndTransfer() {
    const employees = await this.employeeRepo.find();

    for (const emp of employees) {
      await this.transferSickToEarned(emp.id);
    }

    console.log('Year-end transfer completed');
  }

  // =====================================================
  // 🔥 TRANSFER LOGIC (FIXED)
  // =====================================================
  async transferSickToEarned(employeeId: number) {
    const types = await this.leaveTypeRepo.find();

    const sick = types.find((t) =>
      t.name.toLowerCase().includes('Sick Leave'),
    );

    const earned = types.find((t) =>
      t.name.toLowerCase().includes('Annual Leave'),
    );

    if (!sick || !earned) return;

    const [start, end] = this.getCurrentYearRange();

    const sickLeaves = await this.leaveApplicationRepo.find({
      where: {
        employee: { id: employeeId },
        leaveType: { id: sick.id },
        status: LeaveStatus.APPROVED,
        start_date: Between(start, end),
      },
    });

    const used = sickLeaves.reduce(
      (sum, l) => sum + l.total_days,
      0,
    );

    const remaining = sick.max_days - used;

    if (remaining <= 0) return;

    console.log(
      `Transferred ${remaining} Sick → Earned for employee ${employeeId}`,
    );
  }
}