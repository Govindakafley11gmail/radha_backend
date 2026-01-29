import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetPaymentService } from './asset-payment.service';
import { AssetPaymentController } from './asset-payment.controller';
import { AssetPayment } from './entities/asset-payment.entity';
import { FixedAsset } from '../asset/entities/asset.entity';
import { AccountpostingModule } from 'src/modules/public/accountposting/accountposting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetPayment, FixedAsset]),
    AccountpostingModule, // ✅ Import module providing AccountpostingService and its repositories
  ],
  controllers: [AssetPaymentController],
  providers: [AssetPaymentService],
})
export class AssetPaymentModule {}
