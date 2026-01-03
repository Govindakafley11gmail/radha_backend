import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Labor } from './entities/labor.entity';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';

@Injectable()
export class LaborService {
  constructor(
    @InjectRepository(Labor)
    private readonly laborRepository: Repository<Labor>,
  ) {}

  // ✅ Create Labor
  async create(createLaborDto: CreateLaborDto): Promise<Labor> {
    const labor = this.laborRepository.create(createLaborDto);
    return await this.laborRepository.save(labor);
  }

  // ✅ Get all labors
  async findAll(): Promise<Labor[]> {
    return await this.laborRepository.find({
      relations: ['laborCosts'], // load relation if needed
      order: { id: 'DESC' },
    });
  }

  // ✅ Get single labor
  async findOne(id: string): Promise<Labor> {
    const labor = await this.laborRepository.findOne({
      where: { id },
      relations: ['laborCosts'],
    });

    if (!labor) {
      throw new NotFoundException(`Labor with ID ${id} not found`);
    }

    return labor;
  }

  // ✅ Update labor
  async update(
    id: string,
    updateLaborDto: UpdateLaborDto,
  ): Promise<Labor> {
    const labor = await this.findOne(id);

    Object.assign(labor, updateLaborDto);

    return await this.laborRepository.save(labor);
  }

  // ✅ Delete labor
  async remove(id: string): Promise<void> {
    const labor = await this.findOne(id);
    await this.laborRepository.remove(labor);
  }
}
