import {
  Injectable,
  NotFoundException,
  // ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';
import { ProductionBatch } from './entities/production-batch.entity';
import { RawMaterialCost } from '../../raw-meterials/raw-material-cost/entities/raw-material-cost.entity';
import { RawMaterial } from '../../raw-meterials/raw-material/entities/raw-material.entity';

@Injectable()
export class ProductionBatchService {
  constructor(
    @InjectRepository(ProductionBatch)
    private readonly batchRepository: Repository<ProductionBatch>,

    @InjectRepository(RawMaterialCost)
    private readonly costRepository: Repository<RawMaterialCost>,

    @InjectRepository(RawMaterial)
    private readonly materialRepository: Repository<RawMaterial>,
  ) { }

  /**
   * Create a new production batch with raw material costs
   */
  async create(dto: CreateProductionBatchDto, userId: string): Promise<ProductionBatch> {
    // Check for duplicate batch number

    const totalBatches = await this.batchRepository.count();
    const nextNumber = totalBatches + 1; // next sequential number
    const batchNumber = `BATCH${nextNumber.toString().padStart(4, '0')}`;
    // Create the batch entity
    const batch = this.batchRepository.create({
      batchNumber: batchNumber,
      productionDate: dto.productionDate,
      productType: dto.productType,
      quantityProduced: dto.quantityProduced,
      createdBy: userId,
    });

    // Save batch to generate ID
    const savedBatch = await this.batchRepository.save(batch);

    // Create raw material costs if provided
    const costs: RawMaterialCost[] = [];

    if (dto.rawMaterialCosts && dto.rawMaterialCosts.length > 0) {
      for (const item of dto.rawMaterialCosts) {
        const material = await this.materialRepository.findOne({
          where: { id: item.rawMaterialId },
        });
        if (!material) {
          throw new NotFoundException(`Raw material with id ${item.rawMaterialId} not found`);
        }

        const cost = this.costRepository.create({
          batch: savedBatch,
          rawMaterial: material,
          usedQuantity: item.usedQuantity,
          costAmount: item.usedQuantity * Number(material.standard_cost),
        });

        costs.push(cost);
      }

      await this.costRepository.save(costs);
      savedBatch.rawMaterialCosts = costs;
    }

    return savedBatch;
  }

  /**
   * Retrieve all production batches with their costs
   */
  async findAll(): Promise<ProductionBatch[]> {
    return this.batchRepository.find({
      relations: ['rawMaterialCosts', 'rawMaterialCosts.rawMaterial'],
      order: { productionDate: 'DESC', batchNumber: 'ASC' },
    });
  }

  /**
   * Find a single batch by UUID with costs
   */
  async findOne(id: string): Promise<ProductionBatch> {
    const batch = await this.batchRepository.findOne({
      where: { id },
      relations: ['rawMaterialCosts', 'rawMaterialCosts.rawMaterial'],
    });

    if (!batch) {
      throw new NotFoundException(`Production batch with ID ${id} not found`);
    }

    return batch;
  }

  /**
   * Update an existing production batch
   */
  async update(id: string, dto: UpdateProductionBatchDto, userId: string): Promise<ProductionBatch> {
    const batch = await this.findOne(id);

    // Check batch number uniqueness if changed
    // if (dto.batchNumber && dto.batchNumber !== batch.batchNumber) {
    //   const existing = await this.batchRepository.findOne({
    //     where: { batchNumber: dto.batchNumber },
    //   });
    //   if (existing) {
    //     throw new ConflictException(`Batch number ${dto.batchNumber} is already in use`);
    //   }
    //   batch.batchNumber = dto.batchNumber;
    // }

    if (dto.productionDate !== undefined) batch.productionDate = dto.productionDate;
    if (dto.productType !== undefined) batch.productType = dto.productType;
    if (dto.quantityProduced !== undefined) {
      if (dto.quantityProduced < 0) {
        throw new BadRequestException('Quantity produced cannot be negative');
      }
      batch.quantityProduced = dto.quantityProduced;
    }

    batch.updatedBy = userId;

    // Optional: Update raw material costs if included in DTO
    if (dto.rawMaterialCosts && dto.rawMaterialCosts.length > 0) {
      // Remove old costs
      await this.costRepository.delete({ batch: { id: batch.id } });

      const costs: RawMaterialCost[] = [];

      for (const item of dto.rawMaterialCosts) {
        const material = await this.materialRepository.findOne({
          where: { id: item.rawMaterialId },
        });
        if (!material) {
          throw new NotFoundException(`Raw material with id ${item.rawMaterialId} not found`);
        }

        const cost = this.costRepository.create({
          batch: batch,
          rawMaterial: material,
          usedQuantity: item.usedQuantity,
          costAmount: item.usedQuantity * Number(material.standard_cost),
        });

        costs.push(cost);
      }

      await this.costRepository.save(costs);
      batch.rawMaterialCosts = costs;
    }

    return this.batchRepository.save(batch);
  }

  /**
   * Delete a production batch along with its raw material costs
   */
  async remove(id: string): Promise<void> {
    const batch = await this.findOne(id);

    // Delete costs first
    await this.costRepository.delete({ batch: { id: batch.id } });

    await this.batchRepository.remove(batch);
  }
}
