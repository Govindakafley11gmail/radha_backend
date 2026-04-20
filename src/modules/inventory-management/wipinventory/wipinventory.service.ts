/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WIPInventory } from './entities/wipinventory.entity';
import { ProductionBatch } from 'src/modules/cost-accounting/ProductionCosting/production-batch/entities/production-batch.entity';
import { UpdateWipinventoryDto } from './dto/update-wipinventory.dto';
import { AccountpostingService, CostEntry } from 'src/modules/public/accountposting/accountposting.service';
import { Dispatch } from 'src/modules/public/dispatch/entities/dispatch.entity';
import { RawMaterialInventory } from '../raw-material-inventory/entities/raw-material-inventory.entity';

@Injectable()
export class WipinventoryService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(WIPInventory)
    private readonly wipRepo: Repository<WIPInventory>,

    @InjectRepository(ProductionBatch)
    private readonly batchRepo: Repository<ProductionBatch>,

    private readonly accountPostingService: AccountpostingService, // Inject AccountpostingService
  ) { }

  /**
   * Post WIP Inventory and generate accounting entries
   */
  async postWIPInventory(batchId: string): Promise<WIPInventory> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Fetch batch with all costs
      const batch = await queryRunner.manager.findOne(ProductionBatch, {
        where: { id: batchId },
        relations: [
          'machineUsageCosts',
          'laborCosts',
          'otherProductionCosts',
          'rawMaterialCosts',
          'productUnitCosts',
        ],
      });
      const rawMaterialCosts = batch?.rawMaterialCosts || [];
      const inventoryRepo = queryRunner.manager.getRepository(RawMaterialInventory);

      for (const item of rawMaterialCosts) {
        const rawMaterialId = item.rawMaterial.id;
        const usedQty = Number(item.usedQuantity);
        // 1. find inventory for this raw material
        const inventory = await inventoryRepo.findOne({
          where: { raw_material_id: rawMaterialId },
        });

        if (!inventory) {
          throw new Error(`Inventory not found for ${item.rawMaterial.name}`);
        }
        // 2. reduce quantity
        const currentQty = Number(inventory.quantity_on_hand);
        const newQty = currentQty - usedQty;
        if (newQty < 0) {
          throw new Error(
            `Insufficient stock for ${item.rawMaterial.name}`
          );
        }

        inventory.quantity_on_hand = newQty;

        // 3. save
        await inventoryRepo.save(inventory);
      }
      const lastDispatch = await queryRunner.manager
        .createQueryBuilder(Dispatch, 'dispatch')
        .orderBy('dispatch.versionNo', 'DESC')
        .getOne();

      const versionNo = lastDispatch ? lastDispatch.versionNo + 1 : 1;
      const dispatchNo = `RADHA/${new Date().getFullYear()}/WIP/${String(versionNo).padStart(4, '0')}`;

      // 3️⃣ Create dispatch entity
      const dispatchEntity = queryRunner.manager.create(Dispatch, {
        dispatchDate: new Date(),
        remarks: "WIP Inventory Dispatch",
        versionNo,    // ✅ required
        dispatchNo,   // ✅ required
      });
      await queryRunner.manager.save(dispatchEntity);
      if (!batch) throw new NotFoundException('Batch not found');
      // 2️⃣ Calculate total batch cost
      const machineCost =
        batch.machineUsageCosts?.reduce(
          (sum, m) =>
            sum +
            Number(m.operatingCost || 0) +
            Number(m.powerCost || 0) +
            Number(m.maintenanceCost || 0) +
            Number(m.depreciation || 0),
          0,
        ) ?? 0;

      const laborCost =
        batch.laborCosts?.reduce(
          (sum, l) => sum + Number(l.totalCost || 0),
          0,
        ) ?? 0;

      const overheadCost =
        batch.otherProductionCosts?.reduce(
          (sum, o) => sum + Number(o.amount || 0),
          0,
        ) ?? 0;

      const totalCost = machineCost + laborCost + overheadCost;

      // 3️⃣ Create WIPInventory record
      const wip = queryRunner.manager.create(WIPInventory, {
        batch,
        quantity: batch.quantityProduced,
        cost: totalCost,
      });

      const savedWIP = await queryRunner.manager.save(wip);
      // 4️⃣ Prepare accounting entries
      const costEntries: CostEntry[] = [
        {
          accountId: savedWIP.id,
          debit: totalCost,
          credit: 0,
          referenceType: 'WIPInventory',
          referenceId: savedWIP.id,
          accountTypeName: 'Work In Progress',
        },
    
        ...batch.laborCosts.map((l) => ({
          accountId: savedWIP.id,
          debit: 0,
          credit: l.totalCost,
          referenceType: 'LaborCost',
          referenceId: savedWIP.id,
          accountTypeName: 'Direct Labor',
        })),
        
        ...batch.otherProductionCosts.map((o) => ({
          accountId: savedWIP.id, // Ledger for overheads
          debit: 0,
          credit: o.amount,
          referenceType: 'OtherProductionCost',
          referenceId: savedWIP.id,
          accountTypeName: 'Factory Overhead',
        })),
      ];
      // 5️⃣ Post accounting entries using AccountpostingService
      if (costEntries.length > 0) {
        await this.accountPostingService.postCosts(
          batch.id,
          dispatchNo, // Example voucher number
          `${batch.batchNumber}`,
          costEntries,
        );
      }

      // 6️⃣ Commit transaction
      await queryRunner.commitTransaction();
      console.log("batch")

      return savedWIP;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Get all WIP inventory records
  async findAll(): Promise<WIPInventory[]> {
    return this.wipRepo.find({ relations: ['batch'], order: { id: 'DESC' } });
  }

  // Get one WIP inventory record by ID
  async findOne(id: string): Promise<WIPInventory> {
    const wip = await this.wipRepo.findOne({ where: { id }, relations: ['batch'] });
    if (!wip) throw new NotFoundException(`WIPInventory with id ${id} not found`);
    return wip;
  }

  // Update WIP inventory
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

  // Delete WIP inventory
  async remove(id: string): Promise<void> {
    const wip = await this.findOne(id);
    await this.wipRepo.remove(wip);
  }
}
