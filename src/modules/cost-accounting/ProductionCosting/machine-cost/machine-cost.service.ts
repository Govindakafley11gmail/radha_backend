import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Machine } from '../machine/entities/machine.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { CreateMachineCostDto } from './dto/create-machine-cost.dto';
import { UpdateMachineCostDto } from './dto/update-machine-cost.dto';
import { MachineUsageCost } from './entities/machine-cost.entity';

@Injectable()
export class MachineCostService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(MachineUsageCost)
    private readonly usageCostRepo: Repository<MachineUsageCost>,

    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,

    @InjectRepository(ProductionBatch)
    private readonly batchRepo: Repository<ProductionBatch>,
  ) { }

  // Create MachineUsageCost with snapshot calculations
  async create(dto: CreateMachineCostDto): Promise<MachineUsageCost> {
    return await this.dataSource.transaction(async (manager) => {
      const machine = await manager.findOne(Machine, { where: { id: dto.machineId } });
      if (!machine) throw new NotFoundException('Machine not found');

      const batch = await manager.findOne(ProductionBatch, {
        where: { id: dto.batchId },
      });
      if (!batch) throw new NotFoundException('Production batch not found');

      // Example snapshot calculation
      const operatingCost = dto.hoursUsed * 50; // replace with your logic
      const depreciation = (machine.purchaseCost / machine.usefulLife / 2080) * dto.hoursUsed;

      const usageCost = manager.create(MachineUsageCost, {
        machine,
        batch,
        hoursUsed: dto.hoursUsed,
        operatingCost,
        depreciation,
        maintenanceCost: dto.operatingCost,
        powerCost: dto.powerCost,
      });

      return await manager.save(usageCost);
    });
  }

  async findAll(): Promise<MachineUsageCost[]> {
    return await this.usageCostRepo.find({ relations: ['machine', 'batch'], order: { transactionDate: 'DESC' } });
  }

  async findOne(id: string): Promise<MachineUsageCost> {
    const usage = await this.usageCostRepo.findOne({ where: { id }, relations: ['machine', 'batch'] });
    if (!usage) throw new NotFoundException(`MachineUsageCost ${id} not found`);
    return usage;
  }

  async update(id: string, dto: UpdateMachineCostDto): Promise<MachineUsageCost> {
    const usage = await this.findOne(id);

    if (dto.hoursUsed !== undefined) {
      usage.hoursUsed = dto.hoursUsed;
      usage.operatingCost = dto.hoursUsed * 50; // recalc
      usage.depreciation = (usage.machine.purchaseCost / usage.machine.usefulLife / 2080) * dto.hoursUsed;
    }

    return await this.usageCostRepo.save(usage);
  }

  async remove(id: string): Promise<void> {
    const usage = await this.findOne(id);
    await this.usageCostRepo.remove(usage);
  }
}
