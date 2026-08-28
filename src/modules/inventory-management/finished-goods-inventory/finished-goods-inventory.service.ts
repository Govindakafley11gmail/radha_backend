import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFinishedGoodsInventoryDto } from './dto/create-finished-goods-inventory.dto';
import { UpdateFinishedGoodsInventoryDto } from './dto/update-finished-goods-inventory.dto';
import { FinishedGoodsInventory } from './entities/finished-goods-inventory.entity';
import { ProductUnitCost } from 'src/modules/cost-accounting/ProductionCosting/product-unit-cost/entities/product-unit-cost.entity';
import { ProductionBatch } from 'src/modules/cost-accounting/ProductionCosting/production-batch/entities/production-batch.entity';

@Injectable()
export class FinishedGoodsInventoryService {
  constructor(
    @InjectRepository(FinishedGoodsInventory)
    private readonly inventoryRepo: Repository<FinishedGoodsInventory>,

    @InjectRepository(ProductUnitCost)
    private readonly productUnitCostRepo: Repository<ProductUnitCost>,

    @InjectRepository(ProductionBatch)
    private readonly productionBatchRepo: Repository<ProductionBatch>,
  ) { }

  async create(dto: CreateFinishedGoodsInventoryDto, userId: number) {
    // Create entity
    const productUnitCost = await this.productUnitCostRepo.findOne({
      where: { batch: { id: dto.productionBatchId } }
    });
    if (!productUnitCost) {
      throw new NotFoundException('Product unit cost not found for the given production batch');
    }
    const productionBatch = await this.productionBatchRepo.findOne({
      where: { id: dto.productionBatchId }
    });
    if (!productionBatch) {
      throw new NotFoundException('Production batch not found');
    }
    const inventory = this.inventoryRepo.create({
      ...dto,
      productUnitCost: { id: productUnitCost.id },
      productionBatch: { id: productionBatch.id },
      createdBy: userId,
    });

    await this.inventoryRepo.save(inventory);
    return inventory;
  }

  findAll() {
    return this.inventoryRepo.find();
  }

  async findOne(id: string) {
    const inventory = await this.inventoryRepo.findOne({ where: { id } });
    if (!inventory) throw new NotFoundException('Finished goods inventory not found');
    return inventory;
  }

 async update(id: string, dto: UpdateFinishedGoodsInventoryDto) {
  const inventory = await this.inventoryRepo.findOne({
    where: { id },
    relations: ['productionBatch', 'productUnitCost'],
  });

  if (!inventory) {
    throw new NotFoundException('Finished goods inventory not found');
  }

  // update production batch if changed
  if (dto.productionBatchId) {
    const productionBatch = await this.productionBatchRepo.findOne({
      where: { id: dto.productionBatchId },
    });

    if (!productionBatch) {
      throw new NotFoundException('Production batch not found');
    }

    const productUnitCost = await this.productUnitCostRepo.findOne({
      where: { batch: { id: dto.productionBatchId } },
    });

    if (!productUnitCost) {
      throw new NotFoundException(
        'Product unit cost not found for the given production batch',
      );
    }

    inventory.productionBatch = productionBatch;
    inventory.productUnitCost = productUnitCost;
  }

  Object.assign(inventory, dto);

  return await this.inventoryRepo.save(inventory);
}

  async remove(id: string) {
    const inventory = await this.findOne(id);
    return this.inventoryRepo.remove(inventory);
  }
}
