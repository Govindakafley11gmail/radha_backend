import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WIPInventory } from './entities/wipinventory.entity';
import { ProductionBatch } from 'src/modules/cost-accounting/ProductionCosting/production-batch/entities/production-batch.entity';
import { CreateWipinventoryDto } from './dto/create-wipinventory.dto';
import { UpdateWipinventoryDto } from './dto/update-wipinventory.dto';


@Injectable()
export class WipinventoryService {
  constructor(
    @InjectRepository(WIPInventory)
    private readonly wipRepo: Repository<WIPInventory>,
    @InjectRepository(ProductionBatch)
    private readonly batchRepo: Repository<ProductionBatch>,
  ) {}

  async create(dto: CreateWipinventoryDto): Promise<WIPInventory> {
    const batch = await this.batchRepo.findOne({ where: { id: dto.batchId } });
    if (!batch) throw new NotFoundException('ProductionBatch not found');

    const wip = this.wipRepo.create({ batch, quantity: dto.quantity, cost: dto.cost });
    return this.wipRepo.save(wip);
  }

  async findAll(): Promise<WIPInventory[]> {
    return this.wipRepo.find({ relations: ['batch'] });
  }

  async findOne(id: string): Promise<WIPInventory> {
    const wip = await this.wipRepo.findOne({ where: { id }, relations: ['batch'] });
    if (!wip) throw new NotFoundException(`WIPInventory with id ${id} not found`);
    return wip;
  }

  async update(id: string, dto: UpdateWipinventoryDto): Promise<WIPInventory> {
    const wip = await this.findOne(id);

    if (dto.batchId) {
      const batch = await this.batchRepo.findOne({ where: { id: dto.batchId } });
      if (!batch) throw new NotFoundException('ProductionBatch not found');
      wip.batch = batch;
    }

    if (dto.quantity !== undefined) wip.quantity = dto.quantity;
    if (dto.cost !== undefined) wip.cost = dto.cost;

    return this.wipRepo.save(wip);
  }

  async remove(id: string): Promise<void> {
    const wip = await this.findOne(id);
    await this.wipRepo.remove(wip);
  }
}
