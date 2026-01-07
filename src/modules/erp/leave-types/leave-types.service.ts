import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from './entities/leave-type.entity';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@Injectable()
export class LeaveTypesService {
  constructor(
    @InjectRepository(LeaveType)
    private readonly leaveTypeRepo: Repository<LeaveType>,
  ) {}

  // Create a new leave type
  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
    const leaveType = this.leaveTypeRepo.create(createLeaveTypeDto);
    return this.leaveTypeRepo.save(leaveType);
  }

  // Get all leave types
  async findAll(): Promise<LeaveType[]> {
    return this.leaveTypeRepo.find();
  }

  // Get a single leave type by ID
  async findOne(id: string): Promise<LeaveType> {
    const leaveType = await this.leaveTypeRepo.findOne({ where: { id } });
    if (!leaveType) {
      throw new NotFoundException(`LeaveType with id ${id} not found`);
    }
    return leaveType;
  }

  // Update a leave type by ID
  async update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType> {
    const leaveType = await this.findOne(id);
    Object.assign(leaveType, updateLeaveTypeDto);
    return this.leaveTypeRepo.save(leaveType);
  }

  // Delete a leave type by ID
  async remove(id: string): Promise<{ message: string }> {
    const leaveType = await this.findOne(id);
    await this.leaveTypeRepo.remove(leaveType);
    return { message: `LeaveType with id ${id} deleted successfully` };
  }
}
