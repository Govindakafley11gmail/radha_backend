/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  ) { }

  // ✅ Create labor cost (transaction-safe)
  async create(
    createLaborCostDto: CreateLaborCostDto,
  ): Promise<LaborCost> {
    return await this.dataSource.transaction(async (manager) => {
      const labor = await manager.findOne(Labor, {
        where: { id: createLaborCostDto.laborId },
      });

      if (!labor) {
        throw new NotFoundException('Labor not found');
      }

      const batch = await manager.findOne(ProductionBatch, {
        where: { id: createLaborCostDto.batchId },
      });

      if (!batch) {
        throw new NotFoundException('Production batch not found');
      }

      const hourlyRateSnapshot = labor.hourlyRate;
      const totalCost =
        createLaborCostDto.hoursWorked * hourlyRateSnapshot;

      const laborCost = manager.create(LaborCost, {
        labor,
        batch,
        hoursWorked: createLaborCostDto.hoursWorked,
        hourlyRateSnapshot,
        totalCost,
      });

      return await manager.save(laborCost);
    });
  }

  // ✅ Get all labor costs
  async findAll(): Promise<LaborCost[]> {
    return await this.laborCostRepo.find({
      relations: ['labor', 'batch'],
      order: { transactionDate: 'DESC' },
    });
  }

  // ✅ Get single labor cost
  async findOne(id: number): Promise<LaborCost> {
    const cost = await this.laborCostRepo.findOne({
      where: { id },
      relations: ['labor', 'batch'],
    });

    if (!cost) {
      throw new NotFoundException(
        `LaborCost with ID ${id} not found`,
      );
    }

    return cost;
  }

  // ✅ Update labor cost (recalculate total)
  async update(
    id: number,
    updateLaborCostDto: UpdateLaborCostDto,
  ): Promise<LaborCost> {
    const cost = await this.findOne(id);

    if (updateLaborCostDto.hoursWorked !== undefined) {
      cost.hoursWorked = updateLaborCostDto.hoursWorked;
      cost.totalCost =
        cost.hoursWorked * cost.hourlyRateSnapshot;
    }


    return await this.laborCostRepo.save(cost);
  }

  // ✅ Remove labor cost
  async remove(id: number): Promise<void> {
    const cost = await this.findOne(id);
    await this.laborCostRepo.remove(cost);
  }
}
