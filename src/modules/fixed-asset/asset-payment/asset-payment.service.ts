import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateAssetPaymentDto } from './dto/create-asset-payment.dto';
import { UpdateAssetPaymentDto } from './dto/update-asset-payment.dto';
import { AssetPayment } from './entities/asset-payment.entity';
import { FixedAsset } from '../asset/entities/asset.entity';
import { AccountpostingService } from 'src/modules/public/accountposting/accountposting.service';

interface CostEntry {
  accountId: string;
  debit: number;
  credit: number;
  accountTypeName: string;
  referenceId: string;
}

@Injectable()
export class AssetPaymentService {
  constructor(
    @InjectRepository(AssetPayment)
    private readonly paymentRepo: Repository<AssetPayment>,
    @InjectRepository(FixedAsset)
    private readonly assetRepo: Repository<FixedAsset>,
    private readonly dataSource: DataSource,
    private readonly accountPostingService: AccountpostingService,
  ) { }

  /** ✅ Create a payment for an asset and post accounting */
  async create(dto: CreateAssetPaymentDto): Promise<AssetPayment> {
    return await this.dataSource.transaction(async manager => {
      // 1️⃣ Validate asset

      const asset = await manager.findOne(FixedAsset, {
        where: { id: dto.assertId, isDeleted: false },
      });
      if (!asset) throw new NotFoundException('Asset not found');

      const payment = await this.update(dto.paymentId, {
        ...dto,
        status: 'Completed',
      });
      // 2️⃣ Save payment

      const savedPayment = await manager.save(payment);

      // 3️⃣ Post accounting entries
      const costEntries: CostEntry[] = [
        {
          accountId: asset.id, // Dr Cash/Bank
          debit: dto.amount,
          credit: 0,
          accountTypeName: 'Bank',
          referenceId: savedPayment.id,
        },
        {
          accountId: asset.id, // Cr Payable / Vendor
          debit: 0,
          credit: dto.amount,
          accountTypeName: 'Accounts Payable',
          referenceId: savedPayment.id,
        },
      ].filter(e => e.debit > 0 || e.credit > 0);

      if (costEntries.length > 0) {
        await this.accountPostingService.postCosts(
          savedPayment.id,
          'ASSET_PAYMENT',
          `Asset payment for ${asset.assetName}`,
          costEntries,
        );
      }

      return savedPayment;
    });
  }

  /** ✅ Get all asset payments */
  async findAll(): Promise<AssetPayment[]> {
    return this.paymentRepo.find({
      order: { paymentDate: 'DESC' },
      relations: ['asset'],
    });
  }

  /** ✅ Get single asset payment */
  async findOne(id: string): Promise<AssetPayment> {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  /** ✅ Update asset payment */
async update(id: string, dto: UpdateAssetPaymentDto): Promise<AssetPayment> {
  const payment = await this.findOne(id);
  Object.assign(payment, dto, { status: 'Completed' });
  return this.paymentRepo.save(payment);
}

  /** ✅ Soft delete asset payment */
  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    payment.isDeleted = true;
    await this.paymentRepo.save(payment);
  }
}
