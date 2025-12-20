import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Branch } from '../branches/entities/branch.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department) private departmentRepository: Repository<Department>,
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const { name, code, branchId } = createDepartmentDto;

    const branch = await this.branchRepository.findOne({ where: { id: branchId } });
    if (!branch) throw new NotFoundException(`Branch with id ${branchId} not found`);

    const department = this.departmentRepository.create({
      name,
      code,
      branch,
    });

    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({ relations: ['branch'] });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['branch'],
    });
    if (!department) throw new NotFoundException(`Department with id ${id} not found`);
    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);

    if (updateDepartmentDto.branchId) {
      const branch = await this.branchRepository.findOne({ where: { id: updateDepartmentDto.branchId } });
      if (!branch) throw new NotFoundException(`Branch with id ${updateDepartmentDto.branchId} not found`);
      department.branch = branch;
    }

    Object.assign(department, updateDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }
}
