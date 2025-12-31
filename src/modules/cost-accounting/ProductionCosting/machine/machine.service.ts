import { Injectable, NotFoundException } from '@nestjs/common';
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

  // ✅ Create Machine
  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const machine = this.machineRepo.create(createMachineDto);
    return await this.machineRepo.save(machine);
  }

  // ✅ Get all Machines
  async findAll(): Promise<Machine[]> {
    return await this.machineRepo.find({
      order: { id: 'DESC' },
    });
  }

  // ✅ Get single Machine
  async findOne(id: number): Promise<Machine> {
    const machine = await this.machineRepo.findOne({
      where: { id },
    });
    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }
    return machine;
  }

  // ✅ Update Machine
  async update(id: number, updateMachineDto: UpdateMachineDto): Promise<Machine> {
    const machine = await this.findOne(id);
    Object.assign(machine, updateMachineDto);
    return await this.machineRepo.save(machine);
  }

  // ✅ Remove Machine
  async remove(id: number): Promise<void> {
    const machine = await this.findOne(id);
    await this.machineRepo.remove(machine);
  }
}
