/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { LaborCost } from './entities/labor-cost.entity';
import { Labor } from '../labor/entities/labor.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { CreateLaborCostDto } from './dto/create-labor-cost.dto';
import { UpdateLaborCostDto } from './dto/update-labor-cost.dto';

@Injectable()
export class LaborCostService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(LaborCost)
    private readonly laborCostRepo: Repository<LaborCost>,

    @InjectRepository(Labor)
    private readonly laborRepo: Repository<Labor>,

    @InjectRepository(ProductionBatch)
    private readonly batchRepo: Repository<ProductionBatch>,
  ) {}

  // --------------------------
  // Create labor cost (transaction-safe)
  // --------------------------
  async create(createDto: CreateLaborCostDto): Promise<LaborCost> {
    return await this.dataSource.transaction(async (manager) => {
      // Find labor
      const labor = await manager.findOne(Labor, {
        where: { id: createDto.laborId },
      });
      if (!labor) throw new NotFoundException('Labor not found');

      // Find production batch
      const batch = await manager.findOne(ProductionBatch, {
        where: { id: createDto.batchId },
      });
      if (!batch) throw new NotFoundException('Production batch not found');

      // Snapshot hourly rate
      const hourlyRateSnapshot = createDto.hourlyRateSnapshot ?? labor.hourlyRate;

      // Calculate total cost
      const totalCost = createDto.hoursWorked * hourlyRateSnapshot;

      // Create labor cost entity
      const laborCost = manager.create(LaborCost, {
        labor,
        batch,
        hoursWorked: createDto.hoursWorked,
        hourlyRateSnapshot,
        totalCost,
      });

      return await manager.save(laborCost);
    });
  }

  // --------------------------
  // Get all labor costs
  // --------------------------
  async findAll(): Promise<LaborCost[]> {
    return await this.laborCostRepo.find({
      relations: ['labor', 'batch'],
      order: { transactionDate: 'DESC' },
    });
  }

  // --------------------------
  // Get single labor cost
  // --------------------------
  async findOne(id: number): Promise<LaborCost> {
    const cost = await this.laborCostRepo.findOne({
      where: { id },
      relations: ['labor', 'batch'],
    });
    if (!cost) throw new NotFoundException(`LaborCost with ID ${id} not found`);
    return cost;
  }

  // --------------------------
  // Update labor cost (recalculate total)
  // --------------------------
  async update(id: number, updateDto: UpdateLaborCostDto): Promise<LaborCost> {
    const cost = await this.findOne(id);

    if (updateDto.hoursWorked !== undefined) {
      cost.hoursWorked = updateDto.hoursWorked;
      cost.totalCost = cost.hoursWorked * cost.hourlyRateSnapshot;
    }

    if (updateDto.hourlyRateSnapshot !== undefined) {
      cost.hourlyRateSnapshot = updateDto.hourlyRateSnapshot;
      cost.totalCost = cost.hoursWorked * cost.hourlyRateSnapshot;
    }

    return await this.laborCostRepo.save(cost);
  }

  // --------------------------
  // Remove labor cost
  // --------------------------
  async remove(id: number): Promise<void> {
    const cost = await this.findOne(id);
    await this.laborCostRepo.remove(cost);
  }
}
