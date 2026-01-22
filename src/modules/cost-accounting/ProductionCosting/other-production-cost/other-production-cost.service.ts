import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { OtherProductionCost } from './entities/other-production-cost.entity';
import { ProductionBatch } from '../production-batch/entities/production-batch.entity';
import { CreateOtherProductionCostDto } from './dto/create-other-production-cost.dto';
import { UpdateOtherProductionCostDto } from './dto/update-other-production-cost.dto';

import {
  AccountpostingService,
  CostEntry,
} from 'src/modules/public/accountposting/accountposting.service';
import { Dispatch } from 'src/modules/public/dispatch/entities/dispatch.entity';

@Injectable()
export class OtherProductionCostService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(OtherProductionCost)
    private readonly otherCostRepo: Repository<OtherProductionCost>,

    @InjectRepository(ProductionBatch)
    private readonly batchRepo: Repository<ProductionBatch>,

    private readonly accountPostingService: AccountpostingService,
  ) {}

  // =====================================================
  // CREATE (Overhead Cost + Accounting Posting)
  // =====================================================
  async create(dto: CreateOtherProductionCostDto): Promise<OtherProductionCost> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Validate Production Batch
      const batch = await queryRunner.manager.findOne(ProductionBatch, {
        where: { id: dto.batchId },
      });

      if (!batch) {
        throw new NotFoundException(
          `Production batch ${dto.batchId} not found`,
        );
      }

      // 2️⃣ Save Other Production Cost (OVERHEAD)
      const cost = queryRunner.manager.create(OtherProductionCost, {
        batch,
        costType: dto.costType, // POWER / RENT / WATER / SECURITY etc
        amount: dto.amount,
        transactionDate: dto.transactionDate,
      });

      const savedCost = await queryRunner.manager.save(cost);
   const lastDispatch = await queryRunner.manager
      .createQueryBuilder(Dispatch, 'dispatch')
      .orderBy('dispatch.versionNo', 'DESC')
      .getOne();

    const versionNo = lastDispatch ? lastDispatch.versionNo + 1 : 1;
    const dispatchNo = `RADHA/${new Date().getFullYear()}/Machine-cost/${String(versionNo).padStart(4, '0')}`;

    const dispatchEntity = queryRunner.manager.create(Dispatch, {
      dispatchDate: new Date(),
      remarks: `Machine costs for batch ${batch.batchNumber}`,
      versionNo,
      dispatchNo,
    });
    await queryRunner.manager.save(dispatchEntity);
      // 3️⃣ Build accounting entries
      // Dr Work In Progress
      // Cr Factory Overhead
      const costEntries: CostEntry[] = [
        {
          accountId: batch.id,
          debit: dto.amount,
          credit: 0,
          referenceType: 'OtherProductionCost',
          referenceId: savedCost.id,
          accountTypeName: 'Work In Progress',
        },
        {
          accountId: batch.id,
          debit: 0,
          credit: dto.amount,
          referenceType: 'OtherProductionCost',
          referenceId: savedCost.id,
          accountTypeName: 'Factory Overhead',
        },
      ];
      // 4️⃣ Post to Accounting
      await this.accountPostingService.postCosts(
        batch.id,
        dispatchNo,
        `OVERHEAD-${savedCost.id}`,
        costEntries,
      );

      await queryRunner.commitTransaction();
      return savedCost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // =====================================================
  // READ
  // =====================================================
  async findAll(): Promise<OtherProductionCost[]> {
    return this.otherCostRepo.find({
      relations: ['batch'],
      order: { transactionDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<OtherProductionCost> {
    const cost = await this.otherCostRepo.findOne({
      where: { id },
      relations: ['batch'],
    });

    if (!cost) {
      throw new NotFoundException(
        `OtherProductionCost with ID ${id} not found`,
      );
    }

    return cost;
  }

  // =====================================================
  // UPDATE (Data only – accounting re-posting optional)
  // =====================================================
  async update(
    id: string,
    dto: UpdateOtherProductionCostDto,
  ): Promise<OtherProductionCost> {
    const cost = await this.findOne(id);

    if (dto.costType !== undefined) cost.costType = dto.costType;
    if (dto.amount !== undefined) cost.amount = dto.amount;
    if (dto.transactionDate !== undefined)
      cost.transactionDate = dto.transactionDate;

    return this.otherCostRepo.save(cost);
  }

  // =====================================================
  // DELETE
  // =====================================================
  async remove(id: string): Promise<void> {
    const cost = await this.findOne(id);
    await this.otherCostRepo.remove(cost);
  }
}
