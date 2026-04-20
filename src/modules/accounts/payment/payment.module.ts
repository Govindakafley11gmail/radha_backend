import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity'; // Adjust path if needed
import { PaymentReceiptPDFService } from './paymentReceipt';
import { PaymentVoucherPDFService } from './paymentVoucher';
@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]), // Registers the Payment entity
  ],
  controllers: [PaymentController],
  providers: [PaymentService,PaymentReceiptPDFService,PaymentVoucherPDFService],
  exports: [PaymentService], // Optional: export if used in other modules
})
export class PaymentModule {}