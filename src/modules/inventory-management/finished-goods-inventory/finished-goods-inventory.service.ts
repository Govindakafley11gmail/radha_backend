import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFinishedGoodsInventoryDto } from './dto/create-finished-goods-inventory.dto';
import { UpdateFinishedGoodsInventoryDto } from './dto/update-finished-goods-inventory.dto';
import { FinishedGoodsInventory } from './entities/finished-goods-inventory.entity';

@Injectable()
export class FinishedGoodsInventoryService {
  constructor(
    @InjectRepository(FinishedGoodsInventory)
    private readonly inventoryRepo: Repository<FinishedGoodsInventory>,
  ) {}

  async create(dto: CreateFinishedGoodsInventoryDto, userId: number) {
    // Create entity
    const inventory = this.inventoryRepo.create({
      ...dto,
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
    const inventory = await this.inventoryRepo.preload({
      id,
      ...dto,
    });
    if (!inventory) throw new NotFoundException('Finished goods inventory not found');
    return this.inventoryRepo.save(inventory);
  }

  async remove(id: string) {
    const inventory = await this.findOne(id);
    return this.inventoryRepo.remove(inventory);
  }
}
