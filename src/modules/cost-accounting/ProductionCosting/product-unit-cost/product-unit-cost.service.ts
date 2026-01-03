import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductUnitCost } from './entities/product-unit-cost.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { CreateProductUnitCostDto } from './dto/create-product-unit-cost.dto';
import { UpdateProductUnitCostDto } from './dto/update-product-unit-cost.dto';

@Injectable()
export class ProductUnitCostService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(ProductUnitCost)
    private readonly productUnitCostRepo: Repository<ProductUnitCost>,

    @InjectRepository(ProductionBatch)
    private readonly batchRepo: Repository<ProductionBatch>,
  ) {}

  // ----------------------
  // CREATE Product Unit Cost
  // ----------------------
  async create(createDto: CreateProductUnitCostDto): Promise<ProductUnitCost> {
    return await this.dataSource.transaction(async (manager) => {
      const batch = await manager.findOne(ProductionBatch, {
        where: { id: createDto.batchId },
      });
      if (!batch) throw new NotFoundException('Production batch not found');

      const unitCost = manager.create(ProductUnitCost, {
        batch,
        costPerKg: createDto.costPerKg,
        costPerBox: createDto.costPerBox,
        costPerNail: createDto.costPerNail,
        processCuttingCost: createDto.processCuttingCost,
        processHeadingCost: createDto.processHeadingCost,
        processPolishingCost: createDto.processPolishingCost,
        processPackingCost: createDto.processPackingCost,
      });

      return await manager.save(unitCost);
    });
  }

  // ----------------------
  // GET ALL Product Unit Costs
  // ----------------------
  async findAll(): Promise<ProductUnitCost[]> {
    return await this.productUnitCostRepo.find({
      relations: ['batch'],
      order: { createdAt: 'DESC' },
    });
  }

  // ----------------------
  // GET SINGLE Product Unit Cost
  // ----------------------
  async findOne(id: string): Promise<ProductUnitCost> {
    const unitCost = await this.productUnitCostRepo.findOne({
      where: { id },
      relations: ['batch'],
    });
    if (!unitCost) throw new NotFoundException(`ProductUnitCost ${id} not found`);
    return unitCost;
  }

  // ----------------------
  // UPDATE Product Unit Cost
  // ----------------------
  async update(id: string, updateDto: UpdateProductUnitCostDto): Promise<ProductUnitCost> {
    const unitCost = await this.findOne(id);

    Object.assign(unitCost, updateDto);
    return await this.productUnitCostRepo.save(unitCost);
  }

  // ----------------------
  // REMOVE Product Unit Cost
  // ----------------------
  async remove(id: string): Promise<void> {
    const unitCost = await this.findOne(id);
    await this.productUnitCostRepo.remove(unitCost);
  }
}
