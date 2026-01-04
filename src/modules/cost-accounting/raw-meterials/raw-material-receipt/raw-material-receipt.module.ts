import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterialReceiptService } from './raw-material-receipt.service';
import { RawMaterialReceiptController } from './raw-material-receipt.controller';
import { RawMaterialReceipt } from './entities/raw-material-receipt.entity';
import { ReceiptPDFService } from './receiptPDFServices';
import { RawMaterialInventory } from 'src/modules/inventory-management/raw-material-inventory/entities/raw-material-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawMaterialReceipt, RawMaterialInventory])], // ✅ Include both entities
  controllers: [RawMaterialReceiptController],
  providers: [RawMaterialReceiptService,ReceiptPDFService],
})
export class RawMaterialReceiptModule {}
