import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterialService } from './raw-material.service';
import { RawMaterialController } from './raw-material.controller';
import { RawMaterial } from './entities/raw-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawMaterial])], // Register the entity
  controllers: [RawMaterialController],
  providers: [RawMaterialService],
})
export class RawMaterialModule {}
