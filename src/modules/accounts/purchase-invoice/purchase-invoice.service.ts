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

@Injectable()
export class PurchaseInvoiceService {
  constructor(
    @InjectRepository(PurchaseInvoice)
    private readonly purchaseInvoiceRepository: Repository<PurchaseInvoice>,
      private readonly dataSource: DataSource, // ✅ add this

  ) { }

async createAndPostInvoice(
  createDto: CreatePurchaseInvoiceDto,
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
    let totalTax = createDto.GStTaxAmount ?? 0; // one tax only
    let otherCharges = (createDto.freightCost ?? 0) + (createDto.importDuty ?? 0);

    if (createDto.details?.length) {
      createDto.details.forEach(d => {
        materialCost += d.total ?? d.price * d.quantity;
      });
    }

    const finalCost = materialCost + totalTax + otherCharges;

    // 3️⃣ Create purchase invoice
    const invoice = queryRunner.manager.create(PurchaseInvoice, {
      supplier, // ✅ assign the entity itself
      invoiceNo: createDto.invoiceNo,
      invoiceDate: createDto.invoiceDate,
      dueDate: createDto.invoiceDate,
      finalCost,
      taxAmount: totalTax,
      // freightCost: createDto.freightCost ?? 0,
      // importDuty: createDto.importDuty ?? 0,
      status: 'Posted',
      isDeleted: false,
    });


    const savedInvoice = await queryRunner.manager.save(invoice);

    // 4️⃣ Create invoice details
    if (createDto.details?.length) {
      const detailEntities = createDto.details.map(d =>
        queryRunner.manager.create(PurchaseInvoiceDetail, {
          purchaseInvoice: savedInvoice,
          productId: d.productId,
          productType: d.productType,
          size: d.size,
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
          salesInvoice: savedInvoice,
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
      voucher_no: `PI-${Date.now()}`,
      voucher_amount: savedInvoice.finalCost,
      description: `Purchase Invoice ${savedInvoice.invoiceNo}`,
      transactionDate: savedInvoice.invoiceDate,
      createdBy: '00000000-0000-0000-0000-000000000001',
      updatedBy: '00000000-0000-0000-0000-000000000001',
    });
    const savedTransaction = await queryRunner.manager.save(transaction);

 const glMappings = [
      {
        accountCode: 'INVENTORY',
        debit: materialCost,
        credit: 0,
        description: 'Purchase / Inventory',
      },
      {
        accountCode: 'OTHER_CHARGES',
        debit: otherCharges,
        credit: 0,
        description: 'Freight & Import Duty',
      },
      {
        accountCode: 'GST_INPUT',
        debit: totalTax,
        credit: 0,
        description: 'GST_INPUT',
      },
      {
        accountCode: 'ACCOUNTS_PAYABLE',
        debit: 0,
        credit: finalCost,
        description: 'Supplier Payable',
      },

    ];


    const transactionDetails = glMappings.map(line =>
      queryRunner.manager.create(AccountTransactionDetail, {
        transaction: savedTransaction,
        accountId: savedInvoice.id,
        accountCode: line.accountCode,
        debit: line.debit,
        credit: line.credit,
        description: line.description,
      }),
    );

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
      relations: ['supplier','purchaseInvoiceDetails'],
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
