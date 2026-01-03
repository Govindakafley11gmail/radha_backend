import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawMaterial } from './entities/raw-material.entity';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Injectable()
export class RawMaterialService {
  constructor(
    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepository: Repository<RawMaterial>,
  ) {}

  async create(createRawMaterialDto: CreateRawMaterialDto): Promise<RawMaterial> {
    const rawMaterial = this.rawMaterialRepository.create(createRawMaterialDto);
    return await this.rawMaterialRepository.save(rawMaterial);
  }

  async findAll(): Promise<RawMaterial[]> {
    return await this.rawMaterialRepository.find();
  }

  async findOne(id: string): Promise<RawMaterial> {
    const rawMaterial = await this.rawMaterialRepository.findOne({ where: { id: id.toString() } });
    if (!rawMaterial) {
      throw new NotFoundException(`RawMaterial with ID ${id} not found`);
    }
    return rawMaterial;
  }

  async update(id: string, updateRawMaterialDto: UpdateRawMaterialDto): Promise<RawMaterial> {
    const rawMaterial = await this.findOne(id);
    Object.assign(rawMaterial, updateRawMaterialDto);
    return await this.rawMaterialRepository.save(rawMaterial);
  }

  async remove(id: string): Promise<void> {
    const rawMaterial = await this.findOne(id);
    await this.rawMaterialRepository.remove(rawMaterial);
  }
}
