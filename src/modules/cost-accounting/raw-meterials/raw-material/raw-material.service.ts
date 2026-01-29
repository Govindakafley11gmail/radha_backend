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
    return await this.rawMaterialRepository.find({ where: { is_deleted: false } });
  }

  async findOne(id: string): Promise<RawMaterial> {
    const rawMaterial = await this.rawMaterialRepository.findOne({ where: { id: id.toString(), is_deleted: false } });
    if (!rawMaterial) {
      throw new NotFoundException(`RawMaterial with ID ${id} not found`);
    }
    return rawMaterial;
  }

async update(
  id: string,
  updateRawMaterialDto: UpdateRawMaterialDto,
): Promise<RawMaterial> {

  // 1️⃣ Find existing active record
  const existing = await this.rawMaterialRepository.findOne({
    where: { id, is_deleted: false },
  });

  if (!existing) {
    throw new NotFoundException(`RawMaterial with ID ${id} not found`);
  }

  // 2️⃣ Soft delete old record
  existing.is_deleted = true;
  await this.rawMaterialRepository.save(existing);

  // 3️⃣ Create new version
  const newRawMaterial = this.rawMaterialRepository.create({
    ...existing,
    ...updateRawMaterialDto,
    id,          // VERY IMPORTANT → forces INSERT
    is_deleted: false,
    // parentId: existing.id ?? existing.id,
  });

  return await this.rawMaterialRepository.save(newRawMaterial);
}


  async remove(id: string): Promise<void> {
    const rawMaterial = await this.findOne(id);
    rawMaterial.is_deleted = true;
    await this.rawMaterialRepository.save(rawMaterial);
  }
}
