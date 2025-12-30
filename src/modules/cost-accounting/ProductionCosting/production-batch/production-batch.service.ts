// src/production-batch/production-batch.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';
import { ProductionBatch } from './entities/production-batch.entity';

@Injectable()
export class ProductionBatchService {
  constructor(
    @InjectRepository(ProductionBatch)
    private readonly batchRepository: Repository<ProductionBatch>,
  ) {}

  /**
   * Create a new production batch
   */
  async create(dto: CreateProductionBatchDto): Promise<ProductionBatch> {
    // Check for duplicate batch number (since it's unique in DB)
    const existing = await this.batchRepository.findOne({
      where: { batchNumber: dto.batchNumber },
    });
    if (existing) {
      throw new ConflictException(
        `Batch number ${dto.batchNumber} already exists`,
      );
    }

    const batch = this.batchRepository.create({
      batchNumber: dto.batchNumber,
      productionDate: dto.productionDate,
      productType: dto.productType,
      quantityProduced: dto.quantityProduced,
    });

    return await this.batchRepository.save(batch);
  }

  /**
   * Retrieve all production batches
   */
  async findAll(): Promise<ProductionBatch[]> {
    return await this.batchRepository.find({
      order: {
        productionDate: 'DESC',
        batchNumber: 'ASC',
      },
    });
  }

  /**
   * Find a single batch by UUID
   */
  async findOne(id: string): Promise<ProductionBatch> {
    const batch = await this.batchRepository.findOne({
      where: { id },
    });

    if (!batch) {
      throw new NotFoundException(`Production batch with ID ${id} not found`);
    }

    return batch;
  }

  /**
   * Update an existing production batch
   */
  async update(
    id: string,
    dto: UpdateProductionBatchDto,
  ): Promise<ProductionBatch> {
    const batch = await this.findOne(id); // throws NotFound if missing

    // Handle unique constraint for batchNumber if it's being changed
    if (dto.batchNumber && dto.batchNumber !== batch.batchNumber) {
      const existing = await this.batchRepository.findOne({
        where: { batchNumber: dto.batchNumber },
      });
      if (existing) {
        throw new ConflictException(
          `Batch number ${dto.batchNumber} is already in use`,
        );
      }
      batch.batchNumber = dto.batchNumber;
    }

    if (dto.productionDate !== undefined) {
      batch.productionDate = dto.productionDate;
    }
    if (dto.productType !== undefined) {
      batch.productType = dto.productType;
    }
    if (dto.quantityProduced !== undefined) {
      if (dto.quantityProduced < 0) {
        throw new ConflictException('Quantity produced cannot be negative');
      }
      batch.quantityProduced = dto.quantityProduced;
    }

    return await this.batchRepository.save(batch);
  }

  /**
   * Delete a production batch
   */
  async remove(id: string): Promise<void> {
    const batch = await this.findOne(id); // ensures it exists

    await this.batchRepository.remove(batch);
  }
}