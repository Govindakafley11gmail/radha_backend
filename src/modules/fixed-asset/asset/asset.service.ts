/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { FixedAsset } from './entities/asset.entity';
import { AccountpostingService } from 'src/modules/public/accountposting/accountposting.service';
import { AssetPayment } from '../asset-payment/entities/asset-payment.entity';

interface CostEntry {
  accountId: string;
  debit: number;
  credit: number;
  accountTypeName: string;
  referenceId: string;
}

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(FixedAsset)
    private readonly assetRepo: Repository<FixedAsset>,
    private readonly dataSource: DataSource,
    private readonly accountPostingService: AccountpostingService,
  ) { }

  /** ✅ Create asset with optional paid/credit accounting */
  async create(dto: CreateAssetDto): Promise<FixedAsset> {
    return await this.dataSource.transaction(async manager => {
      // Save asset
      const asset = manager.create(FixedAsset, dto);

      const savedAsset = await manager.save(asset);

      return savedAsset;
    });
  }

  /** ✅ Get all assets (exclude soft-deleted) */
  async findAll(): Promise<FixedAsset[]> {


    return this.assetRepo.find({

      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async fetchApprovalAssert(roles: any[]): Promise<FixedAsset[]> {
    const isAdmin = roles.some(r => r.name === 'Head');
    const isManager = roles.some(r => r.name === 'Manager');

    let statusFilter: string | undefined;

    if (isAdmin) {
      statusFilter = 'Verified';
    } else if (isManager) {
      statusFilter = 'Pending';
    }

    return this.assetRepo.find({
      where: {
        isDeleted: false,
        ...(statusFilter && { status: statusFilter }),
      },
    });
  }

  /** ✅ Get single asset */
  async findOne(id: string): Promise<FixedAsset> {
    const asset = await this.assetRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  /** ✅ Update asset */
  async update(id: string, dto: UpdateAssetDto): Promise<FixedAsset> {
    const asset = await this.findOne(id);
    Object.assign(asset, dto);
    return this.assetRepo.save(asset);
  }

  /** ✅ Approve asset and optionally create payment */
  async approveAsset(
    id: string,
    dto: UpdateAssetDto,
    roles: any[]
  ): Promise<FixedAsset> {
    return await this.dataSource.transaction(async manager => {

      const asset = await manager.findOne(FixedAsset, {
        where: { id, isDeleted: false },
      });

      if (!asset) throw new NotFoundException('Asset not found');

      const isHead = roles.some(r => r.name === 'Head');
      const isAdmin = roles.some(r => r.name === 'Admin');

      const isManager = roles.some(r => r.name === 'Manager');

      if (isHead) {
        asset.status = 'Verified';
      } else if (isManager || isAdmin) {
        asset.status = 'Approved';
      }

      Object.assign(asset, dto);

      const savedAsset = await manager.save(asset);
      if (savedAsset.status === 'Approved') {
           const purchaseCost = Number(savedAsset.purchaseCost);
        const fridgeCost = Number(savedAsset.fridgeCost);
        const otherCost = Number(savedAsset.otherCost);
        console.log('Asset approved, creating payment and posting accounting entries...');
        const payment = manager.create(AssetPayment, {
          asset: savedAsset,
          amount: purchaseCost + fridgeCost + otherCost + (savedAsset.gstApplicable === 'YES' ? purchaseCost * 0.05 : 0),
          status: 'Approved',
          paymentDate: new Date().toISOString().split('T')[0],
          accountId: savedAsset, // ✅ correct account mapping
          description: `Payment for approved asset ${savedAsset.assetName}`,
        });

        await manager.save(payment);

     
console.log('Calculated Costs:', { purchaseCost, fridgeCost, otherCost });
        const gst =
          savedAsset.gstApplicable === 'YES'
            ? purchaseCost * 0.05
            : 0;

        const total = purchaseCost + fridgeCost + otherCost + gst;
  console.log('Total Cost Calculation:', { total, gst });
        const costEntries: CostEntry[] = [
          {
            accountId: savedAsset.id,
            debit: purchaseCost,
            credit: 0,
            accountTypeName: asset.assetType || '',
            referenceId: savedAsset.id,
          },
          {
            accountId: savedAsset.id,
            debit: fridgeCost,
            credit: 0,
            accountTypeName: 'Fridge Cost',
            referenceId: savedAsset.id,
          },
          {
            accountId: savedAsset.id,
            debit: otherCost,
            credit: 0,
            accountTypeName: 'Other Costs',
            referenceId: savedAsset.id,
          },
          {
            accountId: savedAsset.id,
            debit: gst,
            credit: 0,
            accountTypeName: 'GST Input',
            referenceId: savedAsset.id,
          },
          {
            accountId: savedAsset.id,
            debit: 0,
            credit: total,
            accountTypeName: 'Accounts Payable',
            referenceId: savedAsset.id,
          },
        
        ].filter(e => Number(e.debit) > 0 || Number(e.credit) > 0);
        // ===============================
        // ✅ Post Accounting
        // ===============================
        if (costEntries.length > 0) {
          await this.accountPostingService.postCosts(
            savedAsset.id,
            'FIXED_ASSET_PURCHASE',
            `Fixed asset purchase - ${savedAsset.assetName}`,
            costEntries,
          );
        }
      }
      return savedAsset;
    });
  }

  /** ✅ Soft delete asset */
  async remove(id: string): Promise<void> {
    const asset = await this.findOne(id);
    asset.isDeleted = true;
    await this.assetRepo.save(asset);
  }
}
