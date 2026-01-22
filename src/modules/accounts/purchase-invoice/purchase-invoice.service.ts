/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { TaxInvoice } from 'src/modules/taxation-compliance/taxinvoice/entities/taxinvoice.entity';
import { PurchaseInvoiceDetail } from '../purchaseinvoicedetails/entities/purchaseinvoicedetail.entity';
import { Supplier } from '../supplier/entities/supplier.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { Dispatch } from 'src/modules/public/dispatch/entities/dispatch.entity';
import { DispatchService } from 'src/modules/public/dispatch/dispatch.service';

@Injectable()
export class PurchaseInvoiceService {
  constructor(
    @InjectRepository(PurchaseInvoice)
    private readonly purchaseInvoiceRepository: Repository<PurchaseInvoice>,
    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>,
    private readonly dataSource: DataSource,
  private readonly dispatchService: DispatchService, // ✅ inject service, not repository

  ) { }


  async createAndPostInvoice(
    createDto: CreatePurchaseInvoiceDto,
    userId: number
  ): Promise<PurchaseInvoice> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Ensure supplier exists
      const supplier = await queryRunner.manager.findOne(Supplier, {
        where: { supplier_id: createDto.supplierId },
      });
      if (!supplier) throw new NotFoundException('Supplier not found');

      // 2️⃣ Calculate totals
      let materialCost = 0;
      let totalTax = createDto.GStTaxAmount ?? 0;
      let otherCharges = (createDto.freightCost ?? 0) + (createDto.importDuty ?? 0);

      if (createDto.details?.length) {
        createDto.details.forEach(d => {
          materialCost += d.total ?? d.price * d.quantity;
        });
      }

      const finalCost = materialCost + totalTax + otherCharges;
      // 3️⃣ Create purchase invoice
      const invoice = queryRunner.manager.create(PurchaseInvoice, {
        supplier,
        invoiceNo: createDto.invoiceNo,
        invoiceDate: createDto.invoiceDate,
        dueDate: createDto.invoiceDate,
        finalCost,
        materialCost,
        // otherCharges,
        materialTypes: createDto.materialTypes,
        freightCost: createDto.freightCost,
        importDuty: createDto.importDuty,
        taxAmount: totalTax,
        status: 'under_process',
        isDeleted: false,
      });
      const savedInvoice = await queryRunner.manager.save(invoice);

    // 2️⃣ Generate voucherNo
     const lastDispatch = await queryRunner.manager
    .createQueryBuilder(Dispatch, 'dispatch')
    .orderBy('dispatch.versionNo', 'DESC')
    .getOne();

const versionNo = lastDispatch ? lastDispatch.versionNo + 1 : 1;

// 2️⃣ Generate dispatchNo
const dispatchNo = `RADHA/${new Date().getFullYear()}/PI/${String(versionNo).padStart(4, '0')}`;

// 3️⃣ Create dispatch entity
const dispatchEntity = queryRunner.manager.create(Dispatch, {
    dispatchDate: savedInvoice.invoiceDate,
    remarks: `Dispatch for Purchase Invoice ${savedInvoice.invoiceNo}`,
    versionNo,    // ✅ required
    dispatchNo,   // ✅ required
});

// 4️ Save in the same transaction
await queryRunner.manager.save(dispatchEntity);
      // 4️ Create invoice details
      if (createDto.details?.length) {
        const detailEntities = createDto.details.map(d =>
          queryRunner.manager.create(PurchaseInvoiceDetail, {
            purchaseInvoice: savedInvoice,
            productId: d.productId,
            productType: d.productType,
            productCode: d.productCode,
            size: d.size,
            freightCost: d.freightCost,
            price: d.price,
            quantity: d.quantity,
            total: d.total ?? d.price * d.quantity,
            taxAmount: d.taxAmount ?? 0,
          }),
        );
        await queryRunner.manager.save(detailEntities);
      }
      // 5️⃣ Create tax invoices
      if (createDto.details?.length) {
        const taxInvoiceEntities = createDto.details.map(d =>
          queryRunner.manager.create(TaxInvoice, {
            purchaseInvoice: savedInvoice,
            customerId: createDto.supplierId,
            invoiceNumber: createDto.invoiceNo,
            totalAmount: d.total ?? d.price * d.quantity,
            invoiceDate: createDto.invoiceDate,
            taxAmount: d.taxAmount ?? 0,
          }),
        );
        await queryRunner.manager.save(taxInvoiceEntities);
      }

      // 6️⃣ Create account transaction header
      const transaction = queryRunner.manager.create(AccountTransaction, {
        accountId: savedInvoice.id,
        referenceType: 'PURCHASE_INVOICE',
        referenceId: savedInvoice.id,
        voucher_no: `Radha/${new Date().getFullYear()}/PI/`,
        voucher_amount: savedInvoice.finalCost,
        description: `Purchase Invoice ${savedInvoice.invoiceNo}`,
        transactionDate: savedInvoice.invoiceDate,
        createdBy: userId,
        // updatedBy: userId,
      });
      const savedTransaction = await queryRunner.manager.save(transaction);

      // 7️⃣ Map account types and groups (if needed)
      const accountTypes = await this.accountTypeRepository.find({
        where: [
          { name: 'Inventory' },
          { name: 'Freight & Import Duty' },
          { name: 'GST Input' },
          { name: 'Accounts Payable' },
        ],
        relations: ['group'],
      });

      const accountMap: Record<string, { id: string; groupId?: string }> = {};
      accountTypes.forEach(acc => {
        accountMap[acc.name] = {
          id: acc.id,
          groupId: acc.group?.id,
        };
      });
      
      // 8️⃣ Prepare GL mappings
      const glMappings = [
        {
          accountCode: 'INVENTORY',
          debit: materialCost,
          credit: 0,
          description: 'Purchase / Inventory',
          groupId: accountMap['Inventory']?.groupId,
          accountTypeID: accountMap['Inventory']?.id,
        },
        {
          accountCode: 'OTHER_CHARGES',
          debit: otherCharges,
          credit: 0,
          description: 'Freight & Import Duty',
          groupId: accountMap['Freight & Import Duty']?.groupId,
          accountTypeID: accountMap['Freight & Import Duty']?.id,
        },
        {
          accountCode: 'GST_INPUT',
          debit: totalTax,
          credit: 0,
          description: 'GST_INPUT',
          groupId: accountMap['GST Input']?.groupId,
          accountTypeID: accountMap['GST Input']?.id,
        },
        {
          accountCode: 'ACCOUNTS_PAYABLE',
          debit: 0,
          credit: finalCost,
          description: 'Supplier Payable',
          groupId: accountMap['Accounts Payable']?.groupId,
          accountTypeID: accountMap['Accounts Payable']?.id,
        },
      ];
      // 9️⃣ Create transaction details (TypeScript-safe)
      const transactionDetails: AccountTransactionDetail[] = [];

      for (const line of glMappings) {
        const detail = queryRunner.manager.create(AccountTransactionDetail, {
          transaction: savedTransaction,              // relation object
          accountId: savedInvoice.id,
          accountGroup: line.groupId ? { id: line.groupId } : undefined, // relation object
          accountType: line.accountTypeID ? { id: line.accountTypeID } : undefined, // relation object
          accountCode: line.accountCode,
          debit: line.debit,
          credit: line.credit,
          description: line.description,
        });
        transactionDetails.push(detail);
      }

      // save all details
      await queryRunner.manager.save(transactionDetails);

      await queryRunner.commitTransaction();
      return savedInvoice;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ... other methods remain unchanged




  async findAll(search?: {
    invoiceNo?: string;
    supplierName?: string;
    fromDate?: string;
    toDate?: string;
    status?: string; // new status filter
  }): Promise<PurchaseInvoice[]> {
    const query = this.purchaseInvoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.supplier', 'supplier')
      .where('invoice.isDeleted = :isDeleted', { isDeleted: false });

    if (search?.invoiceNo) {
      query.andWhere('invoice.invoiceNo ILIKE :invoiceNo', { invoiceNo: `%${search.invoiceNo}%` });
    }

    if (search?.supplierName) {
      query.andWhere('supplier.name ILIKE :supplierName', { supplierName: `%${search.supplierName}%` });
    }

    if (search?.fromDate) {
      query.andWhere('invoice.invoiceDate >= :fromDate', { fromDate: search.fromDate });
    }

    if (search?.toDate) {
      query.andWhere('invoice.invoiceDate <= :toDate', { toDate: search.toDate });
    }

    if (search?.status) {
      query.andWhere('invoice.status = :status', { status: search.status });
    }

    return await query.getMany();
  }


  async findOne(id: string): Promise<PurchaseInvoice> {
    const invoice = await this.purchaseInvoiceRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['supplier', 'purchaseInvoiceDetails'],
    });
    if (!invoice) throw new NotFoundException(`PurchaseInvoice with id ${id} not found`);
    return invoice;
  }

  async update(
    id: string,
    updatePurchaseInvoiceDto: UpdatePurchaseInvoiceDto,
    invoiceFilePath?: string,
  ): Promise<PurchaseInvoice> {
    const invoice = await this.findOne(id);
    Object.assign(invoice, updatePurchaseInvoiceDto);
    if (invoiceFilePath) invoice.invoiceFile = invoiceFilePath;
    return await this.purchaseInvoiceRepository.save(invoice);
  }

  async ApprovedInvoice(id: string): Promise<PurchaseInvoice> {
    const invoice = await this.findOne(id);
    invoice.status = 'Approved';
    const responseInvoice = await this.purchaseInvoiceRepository.save(invoice);

    return responseInvoice;
  }

  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Soft delete the invoice
      const invoice = await queryRunner.manager.findOne(PurchaseInvoice, { where: { id } });
      if (!invoice) throw new NotFoundException(`PurchaseInvoice with id ${id} not found`);

      invoice.isDeleted = true;
      await queryRunner.manager.save(invoice);

      // 4️⃣ Soft delete associated PurchaseInvoiceDetail
      const invoiceDetails = await queryRunner.manager.find(PurchaseInvoiceDetail, {
        where: { purchaseInvoice: { id } },
      });

      if (invoiceDetails.length > 0) {
        invoiceDetails.forEach(d => (d.isDeleted = true));
        await queryRunner.manager.save(invoiceDetails);
      }

      // 2️⃣ Soft delete associated AccountTransaction
      const transaction = await queryRunner.manager.findOne(AccountTransaction, {
        where: { accountId: id }, // assuming accountId is string
      });
      if (transaction) {
        transaction.isDeleted = true;
        await queryRunner.manager.save(transaction);
      }

      // 3️⃣ Soft delete associated AccountTransactionDetail
      const details = await queryRunner.manager.find(AccountTransactionDetail, {
        where: { accountId: id }, // assuming accountId is string
      });
      if (details.length > 0) {
        details.forEach(d => (d.isDeleted = true));
        await queryRunner.manager.save(details);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
