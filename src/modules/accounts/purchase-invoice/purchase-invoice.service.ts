/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';

@Injectable()
export class PurchaseInvoiceService {
  constructor(
    @InjectRepository(PurchaseInvoice)
    private readonly purchaseInvoiceRepository: Repository<PurchaseInvoice>,
  ) { }

  async create(
    dto: CreatePurchaseInvoiceDto,
    invoiceFilePath?: string,
  ): Promise<PurchaseInvoice> {

    const queryRunner =
      this.purchaseInvoiceRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /* 1️⃣ Save Purchase Invoice */
      const invoice = queryRunner.manager.create(PurchaseInvoice, {
        ...dto,
        invoiceFile: invoiceFilePath,
      });

      const savedInvoice = await queryRunner.manager.save(invoice);

      /* 2️⃣ Save Account Transaction (Header) */
      const transaction = queryRunner.manager.create(AccountTransaction, {
        accountId: savedInvoice.supplier_id,
        voucher_no: `RV-${Date.now().toString()}`, // Example voucher number
        voucher_amount: savedInvoice.totalAmount,
        reference_no: savedInvoice.id,
        description: `Purchase Invoice ${savedInvoice.invoiceNo}`,
        transactionDate: savedInvoice.invoiceDate,
        createdBy: 'system',
      });

      const savedTransaction = await queryRunner.manager.save(transaction);



      const creditAccountType = await queryRunner.manager.find(AccountType, {
        where: { name: In(['Cash', 'Bank']) },
        relations: ['group'],
      });
      console.log('Credit Account Type:', creditAccountType);
      /* 3️⃣ Save Transaction Details (Debit & Credit) */
      const cashAccount = creditAccountType.find(acc => acc.name === 'Cash');
      const bankAccount = creditAccountType.find(acc => acc.name === 'Bank');

      /* 3️⃣ Save Transaction Details (Debit & Credit) */
      const details = queryRunner.manager.create(AccountTransactionDetail, [
        {
          transaction: savedTransaction,
          accountId: savedInvoice.supplier_id, // usually Supplier or Vendor
          debit: savedInvoice.totalAmount,
          credit: 0,
          description: 'Purchase debit',
          accountType: { id: cashAccount?.id },   // Cash account
          accountGroup: { id: cashAccount?.group.id },
        },
        {
          transaction: savedTransaction,
          accountId: savedInvoice.supplier_id,
          debit: 0,
          credit: savedInvoice.totalAmount,
          description: 'Supplier credit',
          accountType: { id: bankAccount?.id },   // Bank account
          accountGroup: { id: bankAccount?.group.id },
        },
      ]);

      await queryRunner.manager.save(details);

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
      relations: ['supplier'],
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

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    invoice.isDeleted = true;
    await this.purchaseInvoiceRepository.save(invoice);
  }
}
