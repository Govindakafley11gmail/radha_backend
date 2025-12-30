import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountSchemeService } from './discount-scheme.service';
import { DiscountSchemeController } from './discount-scheme.controller';
import { DiscountScheme } from './entities/discount-scheme.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiscountScheme]), // ✅ Register repository
  ],
  controllers: [DiscountSchemeController],
  providers: [DiscountSchemeService],
})
export class DiscountSchemeModule {}
