import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterialReceiptService } from './raw-material-receipt.service';
import { RawMaterialReceiptController } from './raw-material-receipt.controller';
import { RawMaterialReceipt } from './entities/raw-material-receipt.entity';
import { ReceiptPDFService } from './receiptPDFServices';

@Module({
  imports: [TypeOrmModule.forFeature([RawMaterialReceipt])], // Register the entity
  controllers: [RawMaterialReceiptController],
  providers: [RawMaterialReceiptService,ReceiptPDFService],
})
export class RawMaterialReceiptModule {}
