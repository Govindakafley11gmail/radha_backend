/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { RawMaterialReceipt } from './entities/raw-material-receipt.entity';
import { CreateRawMaterialReceiptDto } from './dto/create-raw-material-receipt.dto';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';
import { Supplier } from 'src/modules/accounts/supplier/entities/supplier.entity';
// import { RawMaterial } from '../raw-material/entities/raw-material.entity';
import { ReceiptPDFService } from './receiptPDFServices';
// import { Payment, PaymentStatus } from 'src/modules/accounts/payment/entities/payment.entity';
import { Dispatch } from 'src/modules/public/dispatch/entities/dispatch.entity';
import { existsSync } from 'fs';
import { join } from 'path';
import { Payment } from 'src/modules/accounts/payment/entities/payment.entity';
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
    documentPath?: string, // new optional param
  ): Promise<RawMaterialReceipt> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // const rawMaterial = await queryRunner.manager.findOne(RawMaterial, {
      //   where: { id: createDto.raw_material_id },
      // });
      // if (!rawMaterial) throw new NotFoundException('Raw Material not found');

      const supplier = await queryRunner.manager.findOne(Supplier, {
        where: { supplier_id: createDto.supplier_id },
      });
      if (!supplier) throw new NotFoundException('Supplier not found');

      const purchaseInvoice = await queryRunner.manager.findOne(PurchaseInvoice, {
        where: { id: createDto.purchase_invoice_id },
      });
      if (!purchaseInvoice) throw new NotFoundException('Purchase Invoice not found');


      const lastDispatch = await queryRunner.manager
        .createQueryBuilder(Dispatch, 'dispatch')
        .orderBy('dispatch.versionNo', 'DESC')
        .getOne();

      const versionNo = lastDispatch ? lastDispatch.versionNo + 1 : 1;

      // 2️⃣ Generate dispatchNo
      const dispatchNo = `RADHA/${new Date().getFullYear()}/METERIALS/${String(versionNo).padStart(4, '0')}`;

      // 3️⃣ Create dispatch entity
      const dispatchEntity = queryRunner.manager.create(Dispatch, {
        dispatchDate: purchaseInvoice.invoiceDate,
        remarks: `Dispatch for Purchase Invoice Raw meterials ${purchaseInvoice.invoiceNo}`,
        versionNo,    // ✅ required
        dispatchNo,   // ✅ required
      });

      // 4️ Save in the same transaction
      await queryRunner.manager.save(dispatchEntity);
      const receipt = queryRunner.manager.create(RawMaterialReceipt, {
        // rawMaterial,
        supplier,
        purchaseInvoice,
        payment_remarks: createDto.payment_remarks,
        receipt_no: dispatchNo,
        receivedDate: createDto.received_date ? new Date(createDto.received_date) : new Date(),
        documentPath: documentPath ?? undefined, // <-- make sure null is converted to undefined
        status: 'Processed'
      });
      const savedReceipt = await queryRunner.manager.save(receipt);
      console.log(createDto.supplier_id)
      // Optionally create a payment entry
      // const payment = queryRunner.manager.create(Payment, {
      //   invoice: purchaseInvoice,
      //   amount: createDto.total_cost,
      //   paymentDate: new Date().toISOString().split('T')[0],
      //   status: PaymentStatus.PENDING,
      //   accountNo: createDto.accountNo,
      //   paymentMode: createDto.paymentMode,
      //   description: createDto.payment_remarks,
      //   documentPath: documentPath ?? undefined,
      //   supplierId: createDto.supplier_id,
      //   rawMaterilReceiptId: savedReceipt.id
      // });
      // await queryRunner.manager.save(payment);

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
  async findAll(search?: string): Promise<RawMaterialReceipt[]> {
    const qb = this.receiptRepository
      .createQueryBuilder('receipt')
      // .leftJoinAndSelect('receipt.rawMaterial', 'rawMaterial')
      .leftJoinAndSelect('receipt.supplier', 'supplier')
      .leftJoinAndSelect('receipt.purchaseInvoice', 'invoice');

    if (search) {
      qb.andWhere(
        `
      invoice.invoiceNo ILIKE :search
      OR supplier.name ILIKE :search
      `,
        { search: `%${search}%` },
      );
    }

    return qb.getMany();
  }

  // ================= FIND ALL BY USER ROLE =================
  async findAllByUserRole(
    userId: string,
    roles: any[],
    search?: string,
  ): Promise<RawMaterialReceipt[]> {
    const qb = this.receiptRepository
      .createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.supplier', 'supplier')
      .leftJoinAndSelect('receipt.purchaseInvoice', 'invoice')
      .leftJoinAndSelect('invoice.purchaseInvoiceDetails', 'purchaseInvoiceDetails');


    // ---------------- ROLE-BASED FILTER ----------------
    if (roles.some(r => r.name === 'Admin')) {
      // Admin: fetch all, no status filter
    } else if (roles.some(r => r.name === 'Manager')) {
      // Manager: only receipts with status 'Processed'
      qb.andWhere('receipt.status = :status', { status: 'Processed' });
    } else if (roles.some(r => r.name === 'Head')) {
      // Head: only receipts with status 'Verified'
      qb.andWhere('receipt.status = :status', { status: 'Verified' });
    }else{
        qb.andWhere('1=0'); // always false

    } 

    // ---------------- SEARCH FILTER ----------------
    if (search) {
      qb.andWhere(
        `invoice.invoiceNo ILIKE :search OR supplier.name ILIKE :search`,
        { search: `%${search}%` },
      );
    }

    // ---------------- SORT ----------------
    qb.orderBy('receipt.created_at', 'DESC');

    return qb.getMany();
  }




  // ================= FIND ONE =================
  async findOne(id: string): Promise<RawMaterialReceipt> {
    const receipt = await this.receiptRepository.findOne({
      where: { id: id },
      relations: ['supplier', 'purchaseInvoice', 'purchaseInvoice.purchaseInvoiceDetails', // <-- nested relation
      ],
    });
    if (!receipt)
      throw new NotFoundException(`RawMaterialReceipt with id ${id} not found`);
    return receipt;
  }

  // ================= UPDATE =================
  async update(
    id: string,
    roles: any[],
  ): Promise<RawMaterialReceipt> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Find the existing receipt
      const receipt = await this.findOne(id);

      // 2️⃣ Determine role-based status
      const isAdmin = roles.some(r => r.name === 'Admin');
      const isManager = roles.some(r => r.name === 'Manager');

      if (isAdmin) {
        receipt.status = 'Approved';
      } else if (isManager) {
        receipt.status = 'Verified';
      }

      // 3️⃣ Merge other updates from DTO (excluding status)
      Object.assign(receipt);

      // 4️⃣ Save the receipt first
      const savedReceipt = await queryRunner.manager.save(receipt);

      // 5️⃣ If Admin approved, create a Payment entry
      if (receipt.status === 'Approved') {
        // Make sure you import Payment and PaymentStatus at the top
        const payment = queryRunner.manager.create(Payment, {
          invoice: receipt.purchaseInvoice,
          amount: (receipt.purchaseInvoice.finalCost) ?? 0,
          paymentDate: new Date().toISOString().split('T')[0],
          // status: 'Pending',
          accountNo: receipt.receipt_no,
          paymentMode: receipt.payment_remarks,
          description: receipt.payment_remarks,
          documentPath: receipt.documentPath ?? undefined,
          supplierId: receipt.supplier.supplier_id,
          rawMaterilReceiptId: savedReceipt.id,
        });
        await queryRunner.manager.save(payment);
      }

      await queryRunner.commitTransaction();
      return savedReceipt;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
    const rawMaterialArray = [
      {
        receiptId: receipt.id,
        receiptNo: receipt.receipt_no,

        supplier: {
          id: receipt.supplier.supplier_id,
          name: receipt.supplier.name,
          phone: receipt.supplier.phone_no,
          email: receipt.supplier.email,
        },

        invoice: {
          id: receipt.purchaseInvoice.id,
          invoiceNo: receipt.purchaseInvoice.invoiceNo,
          invoiceDate: receipt.purchaseInvoice.invoiceDate,
          finalCost: receipt.purchaseInvoice.finalCost,
          taxAmount: receipt.purchaseInvoice.taxAmount,
        },

        remarks: receipt.payment_remarks,
        documentPath: receipt.documentPath,
      },
    ]

    console.log("receipt", rawMaterialArray)

    await this.pdfService.generatePDF(rawMaterialArray, res);


    return receipt;
  }
  async downloadDocument(id: string): Promise<{ filePath: string; fileName: string | undefined }> {
    const receipt = await this.receiptRepository.findOne({ where: { id } });
    if (!receipt) throw new NotFoundException(`Receipt ${id} not found`);

    if (!receipt.documentPath) {
      throw new NotFoundException(`No document uploaded for this receipt`);
    }

    const filePath = join(process.cwd(), receipt.documentPath);
    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found on server: ${receipt.documentPath}`);
    }

    return { filePath, fileName: receipt.documentPath.split('/').pop() };
  }
}
