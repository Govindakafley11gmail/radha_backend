import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { ResponseService } from 'src/common/response/response';
import { FixedAsset } from './entities/asset.entity';
import { AccountpostingModule } from 'src/modules/public/accountposting/accountposting.module';

@Module({
  imports: [TypeOrmModule.forFeature([FixedAsset]),AccountpostingModule], // import entity for repository
  controllers: [AssetController],
  providers: [AssetService, ResponseService], // inject services
})
export class AssetModule {}
