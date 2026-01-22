import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Machine } from '../machine/entities/machine.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { CreateMachineCostDto } from './dto/create-machine-cost.dto';
import { UpdateMachineCostDto } from './dto/update-machine-cost.dto';
import { MachineUsageCost } from './entities/machine-cost.entity';
import { AccountpostingService, CostEntry } from 'src/modules/public/accountposting/accountposting.service';
import { Dispatch } from 'src/modules/public/dispatch/entities/dispatch.entity';

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

    private readonly accountPostingService: AccountpostingService,
  ) { }

  /** Create MachineUsageCost and post dynamically to accounting */
async create(dto: CreateMachineCostDto): Promise<MachineUsageCost> {
  // Use a queryRunner for both cost posting and dispatch creation
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1️⃣ Fetch machine
    const machine = await queryRunner.manager.findOne(Machine, { where: { id: dto.machineId } });
    if (!machine) throw new NotFoundException('Machine not found');

    // 2️⃣ Fetch batch
    const batch = await queryRunner.manager.findOne(ProductionBatch, { where: { id: dto.batchId } });
    if (!batch) throw new NotFoundException('Production batch not found');

    // 3️⃣ Snapshot calculations
    const operatingCost = dto.hoursUsed * (dto.operatingRate ?? 50);
    const depreciation = (machine.purchaseCost / machine.usefulLife / 2080) * dto.hoursUsed;
    const powerCost = dto.powerCost ?? 0;
    const maintenanceCost = dto.maintenanceCost ?? 0;

    // 4️⃣ Save MachineUsageCost
    const usageCost = queryRunner.manager.create(MachineUsageCost, {
      machine,
      batch,
      hoursUsed: dto.hoursUsed,
      operatingCost,
      depreciation,
      powerCost,
      maintenanceCost,
    });
    const savedCost = await queryRunner.manager.save(usageCost);

    // 5️⃣ Create Dispatch entity
    const lastDispatch = await queryRunner.manager
      .createQueryBuilder(Dispatch, 'dispatch')
      .orderBy('dispatch.versionNo', 'DESC')
      .getOne();

    const versionNo = lastDispatch ? lastDispatch.versionNo + 1 : 1;
    const dispatchNo = `RADHA/${new Date().getFullYear()}/OtherProductionCost/${String(versionNo).padStart(4, '0')}`;

    const dispatchEntity = queryRunner.manager.create(Dispatch, {
      dispatchDate: new Date(),
      remarks: `Machine costs for batch ${batch.batchNumber}`,
      versionNo,
      dispatchNo,
    });
    await queryRunner.manager.save(dispatchEntity);

    const costEntries: CostEntry[] = [
      { accountId: machine.id, debit: depreciation, credit: 0, accountTypeName: 'Depreciation', referenceId: savedCost.id },
      { accountId: machine.id, debit: powerCost, credit: 0, accountTypeName: 'Power', referenceId: savedCost.id },
      { accountId: machine.id, debit: maintenanceCost, credit: 0, accountTypeName: 'Maintenance', referenceId: savedCost.id },
      { accountId: machine.id, debit: operatingCost, credit: 0, accountTypeName: 'Operating', referenceId: savedCost.id },
      { accountId: machine.id, debit: 0, credit: depreciation + powerCost + maintenanceCost + operatingCost, accountTypeName: 'Production Overhead', referenceId: savedCost.id },

    ].filter(e => e.debit > 0 || e.credit > 0);
    console.log('Cost Entries:', costEntries);
    // 7️⃣ Post to accounting
    if (costEntries.length > 0) {
      await this.accountPostingService.postCosts(
        batch.id,
        dispatchNo,
        `Machine costs posting for batch ${batch.batchNumber}`,
        costEntries,
      );
    }

    await queryRunner.commitTransaction();
    return savedCost;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

  /** Find all usage costs */
  async findAll(): Promise<MachineUsageCost[]> {
    return this.usageCostRepo.find({
      relations: ['machine', 'batch'],
      order: { id: 'DESC' },
    });
  }
  /** Find single usage cost */
  async findOne(id: string): Promise<MachineUsageCost> {
    const usage = await this.usageCostRepo.findOne({
      where: { id },
      relations: ['machine', 'batch'],
    });
    if (!usage) throw new NotFoundException(`MachineUsageCost ${id} not found`);
    return usage;
  }

  /** Update MachineUsageCost and repost accounting dynamically */
  async update(id: string, dto: UpdateMachineCostDto): Promise<MachineUsageCost> {
    return await this.dataSource.transaction(async (manager) => {
      const usage = await manager.findOne(MachineUsageCost, {
        where: { id },
        relations: ['machine', 'batch'],
      });
      if (!usage) throw new NotFoundException(`MachineUsageCost ${id} not found`);

      if (dto.hoursUsed !== undefined) {
        usage.hoursUsed = dto.hoursUsed;
        usage.operatingCost = dto.hoursUsed * (dto.operatingRate ?? 50);
        usage.depreciation = (usage.machine.purchaseCost / usage.machine.usefulLife / 2080) * dto.hoursUsed;
      }

      if (dto.powerCost !== undefined) usage.powerCost = dto.powerCost;
      if (dto.maintenanceCost !== undefined) usage.maintenanceCost = dto.maintenanceCost;

      const updatedCost = await manager.save(usage);

      // Build dynamic cost entries for updated cost
      const costEntries: CostEntry[] = [
        { accountId: usage.machine.depreciationMethod, debit: updatedCost.depreciation, credit: 0, referenceType: 'Depreciation', referenceId: updatedCost.id },
        { accountId: usage.machine.id, debit: updatedCost.powerCost, credit: 0, referenceType: 'Power', referenceId: updatedCost.id },
        { accountId: usage.machine.id, debit: updatedCost.maintenanceCost, credit: 0, referenceType: 'Maintenance', referenceId: updatedCost.id },
        { accountId: usage.machine.id, debit: updatedCost.operatingCost, credit: 0, referenceType: 'Operating', referenceId: updatedCost.id },
      ].filter(e => e.debit > 0);

      if (costEntries.length > 0) {
        await this.accountPostingService.postCosts(
          updatedCost.batch.id,
          updatedCost.machine.id,
          `RADHA/${new Date().getFullYear()}/Machine-cost/UPDATE/${String(updatedCost.id).slice(0, 8)}`, // voucher
          costEntries,
        );
      }

      return updatedCost;
    });
  }
}
