import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtherProductionCost } from './entities/other-production-cost.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { CreateOtherProductionCostDto } from './dto/create-other-production-cost.dto';
import { UpdateOtherProductionCostDto } from './dto/update-other-production-cost.dto';

@Injectable()
export class OtherProductionCostService {
  constructor(
    @InjectRepository(OtherProductionCost)
    private readonly otherCostRepo: Repository<OtherProductionCost>,

    @InjectRepository(ProductionBatch)
    private readonly batchRepo: Repository<ProductionBatch>,
  ) {}

  // ✅ Create a new other production cost
  async create(dto: CreateOtherProductionCostDto): Promise<OtherProductionCost> {
    const batch = await this.batchRepo.findOne({ where: { id: dto.batchId } });
    if (!batch) {
      throw new NotFoundException(`Production batch with ID ${dto.batchId} not found`);
    }

    const cost = this.otherCostRepo.create({
      batch,
      costType: dto.costType,
      amount: dto.amount,
      transactionDate: dto.transactionDate,
    });

    return await this.otherCostRepo.save(cost);
  }

  // ✅ Get all other production costs
  async findAll(): Promise<OtherProductionCost[]> {
    return await this.otherCostRepo.find({
      relations: ['batch'],
      order: { transactionDate: 'DESC' },
    });
  }

  // ✅ Get single other production cost by ID
  async findOne(id: string): Promise<OtherProductionCost> {
    const cost = await this.otherCostRepo.findOne({
      where: { id },
      relations: ['batch'],
    });

    if (!cost) {
      throw new NotFoundException(`OtherProductionCost with ID ${id} not found`);
    }
    return cost;
  }

  // ✅ Update other production cost
  async update(id: string, dto: UpdateOtherProductionCostDto): Promise<OtherProductionCost> {
    const cost = await this.findOne(id);

    if (dto.costType !== undefined) cost.costType = dto.costType;
    if (dto.amount !== undefined) cost.amount = dto.amount;
    if (dto.transactionDate !== undefined) cost.transactionDate = dto.transactionDate;

    return await this.otherCostRepo.save(cost);
  }

  // ✅ Remove other production cost
  async remove(id: string): Promise<void> {
    const cost = await this.findOne(id);
    await this.otherCostRepo.remove(cost);
  }
}
