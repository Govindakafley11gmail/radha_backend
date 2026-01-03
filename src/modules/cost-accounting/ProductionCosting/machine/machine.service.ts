import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
  ) {}

  // Create a new machine
  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const existing = await this.machineRepo.findOne({
      where: { name: createMachineDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Machine with name "${createMachineDto.name}" already exists`,
      );
    }

    const machine = this.machineRepo.create(createMachineDto);
    return await this.machineRepo.save(machine);
  }

  // Get all machines
  async findAll(): Promise<Machine[]> {
    return await this.machineRepo.find({
      relations: ['usageCosts'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get a single machine by UUID
  async findOne(id: string): Promise<Machine> {
    const machine = await this.machineRepo.findOne({
      where: { id }, // ✅ id is string UUID
      relations: ['usageCosts'],
    });

    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }
    return machine;
  }

  // Update machine
  async update(id: string, updateMachineDto: UpdateMachineDto): Promise<Machine> {
    const machine = await this.findOne(id);

    // Check if name is being updated and is unique
    if (updateMachineDto.name && updateMachineDto.name !== machine.name) {
      const existing = await this.machineRepo.findOne({
        where: { name: updateMachineDto.name },
      });
      if (existing) {
        throw new ConflictException(
          `Machine with name "${updateMachineDto.name}" already exists`,
        );
      }
    }

    Object.assign(machine, updateMachineDto);
    return await this.machineRepo.save(machine);
  }

  // Remove machine
  async remove(id: string): Promise<void> {
    const machine = await this.findOne(id);
    await this.machineRepo.remove(machine);
  }
}
