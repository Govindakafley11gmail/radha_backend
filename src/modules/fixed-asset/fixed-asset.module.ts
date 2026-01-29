import { Module } from '@nestjs/common';
import { AssetModule } from './asset/asset.module';
import { AssetPaymentModule } from './asset-payment/asset-payment.module';

@Module({
  imports: [AssetModule, AssetPaymentModule]
})
export class FixedAssetModule {}
