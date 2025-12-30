/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { RawMaterialReceipt } from './entities/raw-material-receipt.entity';
import { CreateRawMaterialReceiptDto } from './dto/create-raw-material-receipt.dto';
import { UpdateRawMaterialReceiptDto } from './dto/update-raw-material-receipt.dto';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';
import { Supplier } from 'src/modules/accounts/supplier/entities/supplier.entity';
import { RawMaterial } from '../raw-material/entities/raw-material.entity';
import { ReceiptPDFService } from './receiptPDFServices';
import { Payment, PaymentMode, PaymentStatus } from 'src/modules/accounts/payment/entities/payment.entity';
@Injectable()
export class RawMaterialReceiptService {
  constructor(
    @InjectRepository(RawMaterialReceipt)
    private readonly receiptRepository: Repository<RawMaterialReceipt>,
    private readonly dataSource: DataSource,
    private readonly pdfService: ReceiptPDFService,

  ) { }

  // ================= CREATE AND POST RAW MATERIAL RECEIPT =================
  async createAndPostReceipt(
    createDto: CreateRawMaterialReceiptDto,
  ): Promise<RawMaterialReceipt> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Fetch related entities
      const rawMaterial = await queryRunner.manager.findOne(RawMaterial, {
        where: { id: createDto.raw_material_id },
      });
      if (!rawMaterial) throw new NotFoundException('Raw Material not found');

      const supplier = await queryRunner.manager.findOne(Supplier, {
        where: { supplier_id: createDto.supplier_id },
      });
      if (!supplier) throw new NotFoundException('Supplier not found');

      const purchaseInvoice = await queryRunner.manager.findOne(PurchaseInvoice, {
        where: { id: createDto.purchase_invoice_id },
      });
      if (!purchaseInvoice) throw new NotFoundException('Purchase Invoice not found');

      // 2️⃣ Calculate total cost
      const materialCost = createDto.total_unit_cost ;
      const freightDuty = (createDto.freight_cost ?? 0) + (createDto.import_duty ?? 0);
      const purchaseTax = createDto.gst_tax_amount ?? 0;

      const totalCost = materialCost + freightDuty + purchaseTax;

      // 3️⃣ Create Raw Material Receipt
      const receipt = queryRunner.manager.create(RawMaterialReceipt, {
        rawMaterial,
        supplier,

        purchaseInvoice,
        quantityReceived: createDto.quantity_received,
        total_unit_cost: createDto.total_unit_cost,
        freightCost: createDto.freight_cost ?? 0,
        importDuty: createDto.import_duty ?? 0,
        scrapQuantity: createDto.scrap_quantity ?? 0,
        purchaseTaxAmount: purchaseTax,
        totalCost,
        receipt_no: `REC-${new Date().toDateString()}`,
        receivedDate: createDto.received_date ? new Date(createDto.received_date) : new Date(),
      });
      const savedReceipt = await queryRunner.manager.save(receipt)

      const payment = queryRunner.manager.create(Payment, {
        invoice: purchaseInvoice,
        amount: totalCost,
        paymentDate: new Date().toISOString().split('T')[0],
        status: PaymentStatus.PENDING,
        paymentMode: PaymentMode.CASH,
        description: `Payment against Invoice ${purchaseInvoice.invoiceNo}`,
      })
        await queryRunner.manager.save(payment);

      await queryRunner.commitTransaction();
      return savedReceipt;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  // ================= FIND ALL =================
  async findAll(): Promise<RawMaterialReceipt[]> {
    return this.receiptRepository.find({
      relations: ['rawMaterial', 'supplier', 'purchaseInvoice'],
    });
  }
  // ================= FIND ONE =================
  async findOne(id: string): Promise<RawMaterialReceipt> {
    const receipt = await this.receiptRepository.findOne({
      where: { id: id },
      relations: ['rawMaterial', 'supplier', 'purchaseInvoice',  'purchaseInvoice.purchaseInvoiceDetails', // <-- nested relation
],
    });
    if (!receipt)
      throw new NotFoundException(`RawMaterialReceipt with id ${id} not found`);
    return receipt;
  }

  // ================= UPDATE =================
  async update(
    id: string,
    updateDto: UpdateRawMaterialReceiptDto,
  ): Promise<RawMaterialReceipt> {
    const receipt = await this.findOne(id);
    Object.assign(receipt, updateDto);


    const materialCost = receipt.total_unit_cost;
    const freightDuty = (receipt.freightCost ?? 0) + (receipt.importDuty ?? 0);
    const purchaseTax = receipt.gst_tax_amount ?? 0;

    receipt.totalCost = materialCost + freightDuty + purchaseTax;

    return this.receiptRepository.save(receipt);
  }
  //   "freightCost": 100,
  // "GStTaxAmount": 110.25,
  // "importDuty": 200,
  // "totalAmount": 1512.75,

  // ================= REMOVE (SOFT DELETE) =================
  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const receipt = await queryRunner.manager.findOne(RawMaterialReceipt, {
        where: { id: id.toString() },
      });
      if (!receipt)
        throw new NotFoundException(`RawMaterialReceipt with id ${id} not found`);

      receipt.is_deleted = true;
      await queryRunner.manager.save(receipt);


      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async generateReceipt(id: string, res: any): Promise<any> {
    const receipt = await this.findOne(id);
    console.log("receipt", receipt)
    await this.pdfService.generatePDF(receipt, res);

    return receipt;
  }
}
