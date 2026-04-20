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
import { RawMaterialInventory, ValuationMethod } from 'src/modules/inventory-management/raw-material-inventory/entities/raw-material-inventory.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
@Injectable()
export class RawMaterialReceiptService {
  constructor(
    @InjectRepository(RawMaterialReceipt)
    private readonly receiptRepository: Repository<RawMaterialReceipt>,
    private readonly dataSource: DataSource,
    private readonly pdfService: ReceiptPDFService,
    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>,

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
        paymentMode: createDto.paymentMode,
        total_cost: createDto.total_cost,
        accountNo: createDto.accountNo,
        receipt_no: dispatchNo,
        received_date: new Date(),
        documentPath: documentPath ?? undefined, // <-- make sure null is converted to undefined
        status: 'Processed'
      });
      const savedReceipt = await queryRunner.manager.save(receipt);
      purchaseInvoice.status = 'Processed'
      await queryRunner.manager.save(purchaseInvoice);

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
      qb.andWhere('receipt.status IN (:...status)', {
        status: ['Processed', 'Verified'],
      });
    } else if (roles.some(r => r.name === 'Manager')) {
      // Manager: only receipts with status 'Processed'
      qb.andWhere('receipt.status = :status', { status: 'Processed' });
    } else if (roles.some(r => r.name === 'Head')) {
      // Head: only receipts with status 'Verified'
      qb.andWhere('receipt.status = :status', { status: 'Verified' });
    } else {
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
  async update(id: string, roles: any[]): Promise<RawMaterialReceipt> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Get existing receipt (BEFORE update)
      const existingReceipt = await this.findOne(id);
      const previousStatus = existingReceipt.status;

      // 2️⃣ Role-based status update
      const isAdmin = roles.some(r => r.name === 'Admin');
      const isHead = roles.some(r => r.name === 'Head');
      const isManager = roles.some(r => r.name === 'Manager');

      if (isAdmin || isHead) {
        existingReceipt.status = 'Approved';
      } else if (isManager) {
        existingReceipt.status = 'Verified';
      }
      // 3️⃣ Save updated receipt
      const savedReceipt = await queryRunner.manager.save(existingReceipt);

      // 4️⃣ Payment (ONLY when newly approved)
      if (previousStatus !== 'Approved' && existingReceipt.status === 'Approved') {

        const receiptWithRelations = await queryRunner.manager.findOne(RawMaterialReceipt, {
          where: { id },
          relations: ["supplier", "purchaseInvoice", "purchaseInvoice.purchaseInvoiceDetails"],
        });

        if (!receiptWithRelations) {
          throw new NotFoundException('Raw material receipt not found');
        }

        // 👉 Create payment
        const payment = queryRunner.manager.create(Payment, {
          rawMaterialReceipt: receiptWithRelations,
          invoice: receiptWithRelations.purchaseInvoice,
          amount: receiptWithRelations.total_cost ?? 0,
          paymentDate: new Date().toISOString().split('T')[0],
          accountNo: receiptWithRelations.receipt_no,
          paymentMode: receiptWithRelations.paymentMode,
          description: receiptWithRelations.payment_remarks,
          documentPath: receiptWithRelations.documentPath ?? undefined,
          supplierId: receiptWithRelations.supplier.supplier_id,
        });

        await queryRunner.manager.save(payment);

        // 👉 Inventory update (ONLY ON APPROVAL)
        for (const item of receiptWithRelations.purchaseInvoice.purchaseInvoiceDetails || []) {

          const rawMaterialId = item.productType;
          const qty = Number(item.quantity);
          const rate = Number(item.total);

          let inventory = await queryRunner.manager.findOne(RawMaterialInventory, {
            where: { raw_material_id: rawMaterialId },
          });

          if (!inventory) {
            inventory = queryRunner.manager.create(RawMaterialInventory, {
              raw_material_id: rawMaterialId,
              quantity_on_hand: qty,
              value: rate,
              valuation_method: ValuationMethod.FIFO
            });
          }

          const newValue = qty * rate;

          inventory.quantity_on_hand += qty;
          inventory.value += newValue;

          await queryRunner.manager.save(inventory);
        }

        let materialCost = 0;

        // -------------------------------
        // 1️⃣ SAFE MATERIAL COST CALCULATION
        // -------------------------------
        const details =
          receiptWithRelations?.purchaseInvoice?.purchaseInvoiceDetails || [];

        materialCost = details.reduce((sum, d) => {
          const total =
            Number(d.total) ||
            Number(d.price) * Number(d.quantity) ||
            0;

          return sum + total;
        }, 0);

        // -------------------------------
        // 2️⃣ TAX & OTHER CHARGES
        // -------------------------------
        const totalTax = Number(
          receiptWithRelations.purchaseInvoice.taxAmount ?? 0,
        );

        const otherCharges =
          Number(receiptWithRelations.purchaseInvoice.freightCost ?? 0) +
          Number(receiptWithRelations.purchaseInvoice.importDuty ?? 0);

        const finalCost = Number(
          receiptWithRelations.purchaseInvoice.finalCost ?? 0,
        );

        // -------------------------------
        // 3️⃣ CREATE ACCOUNT TRANSACTION
        // -------------------------------
        const transaction = queryRunner.manager.create(AccountTransaction, {
          accountId: receiptWithRelations.purchaseInvoice.id,
          referenceType: 'PURCHASE_INVOICE',
          referenceId: receiptWithRelations.id,
          voucher_no: `Radha/${new Date().getFullYear()}/PI/`,
          voucher_amount: finalCost,
          description: `Purchase Invoice ${receiptWithRelations.purchaseInvoice.invoiceNo}`,
          transactionDate: receiptWithRelations.purchaseInvoice.invoiceDate,
          createdBy: 1,
        });

        const savedTransaction = await queryRunner.manager.save(transaction);

        // -------------------------------
        // 4️⃣ GET ACCOUNT TYPES
        // -------------------------------
        const accountTypes = await this.accountTypeRepository.find({
          where: [
            { name: 'Inventory' },
            { name: 'Freight & Import Duty' },
            { name: 'GST Input' },
            { name: 'Accounts Payable' },
          ],
          relations: ['group'],
        });

        const accountMap: Record<string, any> = {};

        accountTypes.forEach(acc => {
          accountMap[acc.name] = {
            id: acc.id,
            groupId: acc.group?.id,
          };
        });

        // -------------------------------
        // 5️⃣ GL MAPPINGS (DOUBLE ENTRY)
        // -------------------------------
        const glMappings = [
          {
            accountCode: 'INVENTORY',
            debit: materialCost,
            credit: 0,
            description: `Inventory - ${receiptWithRelations.purchaseInvoice.description}`,
            groupId: accountMap['Inventory']?.groupId,
            accountTypeID: accountMap['Inventory']?.id,
          },
          {
            accountCode: 'OTHER_CHARGES',
            debit: otherCharges,
            credit: 0,
            description: `Freight & Import Duty - ${receiptWithRelations.purchaseInvoice.description}`,
            groupId: accountMap['Freight & Import Duty']?.groupId,
            accountTypeID: accountMap['Freight & Import Duty']?.id,
          },
          {
            accountCode: 'GST_INPUT',
            debit: totalTax,
            credit: 0,
            description: `GST Input - ${receiptWithRelations.purchaseInvoice.description}`,
            groupId: accountMap['GST Input']?.groupId,
            accountTypeID: accountMap['GST Input']?.id,
          },
          {
            accountCode: 'ACCOUNTS_PAYABLE',
            debit: 0,
            credit: finalCost,
            description: `Accounts Payable - ${receiptWithRelations.purchaseInvoice.description}`,
            groupId: accountMap['Accounts Payable']?.groupId,
            accountTypeID: accountMap['Accounts Payable']?.id,
          },
        ];

        // -------------------------------
        // 6️⃣ CREATE TRANSACTION DETAILS
        // -------------------------------
        const transactionDetails = glMappings.map(line =>
          queryRunner.manager.create(AccountTransactionDetail, {
            transaction: { id: savedTransaction.id }, // ✅ FIX
            accountId:  receiptWithRelations.purchaseInvoice.id ,
            accountGroup: line.groupId ? { id: line.groupId } : undefined,
            accountType: line.accountTypeID ? { id: line.accountTypeID } : undefined,

            accountCode: line.accountCode,
            debit: line.debit,
            credit: line.credit,
            description: line.description,

            // ❌ REMOVE THIS (unless column exists in entity)
            // userId: 1,
          }),
        );

        // -------------------------------
        // 7️⃣ SAVE DETAILS
        // -------------------------------
        await queryRunner.manager.save(transactionDetails);


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
