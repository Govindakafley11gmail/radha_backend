import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LeaveApplication, LeaveStatus } from './entities/leave-application.entity';
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

  // ---------------------------
  // Create leave application
  // ---------------------------
  async create(employeeId: number, createDto: CreateLeaveApplicationDto): Promise<LeaveApplication> {
    const employee = await this.employeeRepo.findOne({ where: { id: employeeId } });
    if (!employee) throw new NotFoundException(`Employee not found`);

    const leaveType = await this.leaveTypeRepo.findOne({ where: { id: createDto.leaveTypeId } });
    if (!leaveType) throw new NotFoundException(`Leave type not found`);

    const leaveApplication = this.leaveApplicationRepo.create({
      employee,
      leaveType,
      start_date: createDto.start_date,
      end_date: createDto.end_date,
      total_days: createDto.total_days,
      reason: createDto.reason,
      status: LeaveStatus.PENDING,
      created_by: employeeId,
    });

    return this.leaveApplicationRepo.save(leaveApplication);
  }

  // ---------------------------
  // Get current year range
  // ---------------------------
  private getCurrentYearRange(): [string, string] {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1); // Jan 1
    const end = new Date(now.getFullYear(), 11, 31); // Dec 31
    return [start.toISOString().split('T')[0], end.toISOString().split('T')[0]];
  }

  // ---------------------------
  // Get all leave applications for employee (current year)
  // ---------------------------
  async findAll(employeeId: number): Promise<LeaveApplication[]> {
    const [startOfYear, endOfYear] = this.getCurrentYearRange();

    return this.leaveApplicationRepo.find({
      where: {
        employee: { id: employeeId },
        start_date: Between(startOfYear, endOfYear),
      },
      relations: ['employee', 'leaveType'],
    });
  }

  // ---------------------------
  // Leave balances (current year)
  // ---------------------------
  async leavesBalance(employeeId: number) {
    const leaveTypes = await this.leaveTypeRepo.find();
    const [startOfYear, endOfYear] = this.getCurrentYearRange();

    const approvedLeaves = await this.leaveApplicationRepo.find({
      where: {
        employee: { id: employeeId },
        status: LeaveStatus.APPROVED,
        start_date: Between(startOfYear, endOfYear),
      },
      relations: ['leaveType'],
    });

    const usedMap: Record<string, number> = {};
    approvedLeaves.forEach((leave) => {
      const typeId = leave.leaveType.id;
      usedMap[typeId] = (usedMap[typeId] || 0) + leave.total_days;
    });

    return leaveTypes.map((type) => ({
      leaveTypeId: type.id,
      leaveTypeName: type.name,
      max_days: type.max_days,
      used_days: usedMap[type.id] || 0,
      remaining_days: type.max_days - (usedMap[type.id] || 0),
    }));
  }

  // ---------------------------
  // Get one leave application by ID (current year only)
  // ---------------------------
  async findOne(employeeId: number, id: string): Promise<LeaveApplication> {
    const [startOfYear, endOfYear] = this.getCurrentYearRange();

    const leaveApplication = await this.leaveApplicationRepo.findOne({
      where: {
        id,
        employee: { id: employeeId },
        start_date: Between(startOfYear, endOfYear),
      },
      relations: ['employee', 'leaveType'],
    });

    if (!leaveApplication)
      throw new NotFoundException(`Leave application not found or you do not have access`);
    return leaveApplication;
  }

  // ---------------------------
  // Update leave application
  // ---------------------------
  async update(
    employeeId: number,
    id: string,
    updateDto: UpdateLeaveApplicationDto,
    userRole: string,
  ): Promise<LeaveApplication> {
    const leaveApplication = await this.leaveApplicationRepo.findOne({
      where: { id },
      relations: ['employee', 'leaveType'],
    });
    if (!leaveApplication) throw new NotFoundException('Leave application not found');

    // Employee updating own leave
    if (!['HR', 'Manager'].includes(userRole)) {
      if (leaveApplication.employee.id !== employeeId) {
        throw new ForbiddenException('You cannot update this leave application');
      }
      const { reason, start_date, end_date, total_days } = updateDto;
      leaveApplication.reason = reason ?? leaveApplication.reason;
      leaveApplication.start_date = start_date ?? leaveApplication.start_date;
      leaveApplication.end_date = end_date ?? leaveApplication.end_date;
      leaveApplication.total_days = total_days ?? leaveApplication.total_days;
    } else {
      // HR/Manager can approve/reject and update any field
      if (updateDto.status && Object.values(LeaveStatus).includes(updateDto.status)) {
        leaveApplication.status = updateDto.status;
      } else if (updateDto.status) {
        throw new ForbiddenException('Invalid status value');
      }
      leaveApplication.approved_by = employeeId;
      Object.assign(leaveApplication, updateDto);
    }

    return this.leaveApplicationRepo.save(leaveApplication);
  }

  // ---------------------------
  // Delete leave application (only owner)
  // ---------------------------
  async remove(employeeId: number, id: string): Promise<{ message: string }> {
    const leaveApplication = await this.findOne(employeeId, id);
    await this.leaveApplicationRepo.remove(leaveApplication);
    return { message: 'Leave application deleted successfully' };
  }
}
