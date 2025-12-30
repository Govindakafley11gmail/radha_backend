import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { RawMaterialCost } from './entities/raw-material-cost.entity';
import { CreateRawMaterialCostDto } from './dto/create-raw-material-cost.dto';
import { UpdateRawMaterialCostDto } from './dto/update-raw-material-cost.dto';

@Injectable()
export class RawMaterialCostService {
  constructor(
    @InjectRepository(RawMaterialCost)
    private readonly rawMaterialCostRepository: Repository<RawMaterialCost>,
  ) {}

  async create(createRawMaterialCostDto: CreateRawMaterialCostDto): Promise<RawMaterialCost> {
    const rawMaterialCost = this.rawMaterialCostRepository.create(createRawMaterialCostDto as DeepPartial<RawMaterialCost>);
    return await this.rawMaterialCostRepository.save(rawMaterialCost);
  }

  async findAll(): Promise<RawMaterialCost[]> {
    return await this.rawMaterialCostRepository.find({ relations: ['rawMaterial', 'batch'] });
  }

  async findOne(id: number): Promise<RawMaterialCost> {
    const rawMaterialCost = await this.rawMaterialCostRepository.findOne({ 
      where: { id }, 
      relations: ['rawMaterial', 'batch'] 
    });
    if (!rawMaterialCost) {
      throw new NotFoundException(`RawMaterialCost with ID ${id} not found`);
    }
    return rawMaterialCost;
  }

  async update(id: number, updateRawMaterialCostDto: UpdateRawMaterialCostDto): Promise<RawMaterialCost> {
    const rawMaterialCost = await this.findOne(id);
    Object.assign(rawMaterialCost, updateRawMaterialCostDto);
    return await this.rawMaterialCostRepository.save(rawMaterialCost);
  }

  async remove(id: number): Promise<void> {
    const rawMaterialCost = await this.findOne(id);
    await this.rawMaterialCostRepository.remove(rawMaterialCost);
  }
}
