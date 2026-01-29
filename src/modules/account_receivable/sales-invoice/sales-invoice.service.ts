/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { SalesInvoice } from './entities/sales-invoice.entity';
import { SalesInvoiceDetail } from '../sales-invoice-details/entities/sales-invoice-detail.entity';
import { TaxInvoice } from 'src/modules/taxation-compliance/taxinvoice/entities/taxinvoice.entity';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto';

import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';

@Injectable()
export class SalesInvoiceService {
  constructor(
    @InjectRepository(SalesInvoice)
    private readonly salesInvoiceRepo: Repository<SalesInvoice>,

    @InjectRepository(SalesInvoiceDetail)
    private readonly detailRepo: Repository<SalesInvoiceDetail>,

    @InjectRepository(TaxInvoice)
    private readonly taxInvoiceRepo: Repository<TaxInvoice>,

    @InjectRepository(AccountType)
    private readonly accountTypeRepo: Repository<AccountType>,

    private readonly dataSource: DataSource,
  ) { }

  // ===============================
  // CREATE & POST SALES INVOICE
  // ===============================
  async createAndPostInvoice(dto: CreateSalesInvoiceDto,userId: number): Promise<SalesInvoice> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      /* --------------------------------
       * 1️⃣ CREATE SALES INVOICE
       * -------------------------------- */
      const invoice = qr.manager.create(SalesInvoice, {
        customer: { customer_id: dto.customerId },
        invoiceNumber: dto.invoiceNumber,
        invoiceDate: dto.invoiceDate,
        dueDate: dto.dueDate,
        totalAmount: dto.totalAmount,
        taxAmount: dto.taxAmount,
        status: 'Posted',
        isDeleted: false,
      });

      const savedInvoice = await qr.manager.save(invoice);

      /* --------------------------------
       * 2️⃣ SALES INVOICE DETAILS
       * -------------------------------- */
      const detailEntities = dto.details?.map(d =>
        qr.manager.create(SalesInvoiceDetail, {
          salesInvoice: savedInvoice,
          productId: d.productId,
          productType: d.productType,
          size: d.size,
          price: d.price,
          quantity: d.quantity,
          total: d.total ?? d.price * d.quantity,
          isDeleted: false,
        }),
      );
      await qr.manager.save(detailEntities);

      /* --------------------------------
       * 3️⃣ TAX INVOICE (ONE PER SALES)
       * -------------------------------- */
      const taxInvoice = qr.manager.create(TaxInvoice, {
        salesInvoice: savedInvoice,
        customerId: dto.customerId,
        invoiceNumber: dto.invoiceNumber,
        invoiceDate: dto.invoiceDate,
        totalAmount: dto.totalAmount,
        taxAmount: dto.taxAmount,
        isDeleted: false,
      });
      await qr.manager.save(taxInvoice);

      /* --------------------------------
       * 4️⃣ FETCH LEDGER ACCOUNTS
       * -------------------------------- */
      const accounts = await this.accountTypeRepo.find({
        where: [
          { name: 'Accounts Receivable' },
          { name: 'Sales Revenue' },
          { name: 'GST Output Payable' },
        ],
        relations: ['group'],
      });

      const acc = (name: string) => {
        const a = accounts.find(x => x.name === name);
        if (!a) throw new Error(`Ledger ${name} not configured`);
        return a;
      };

      const AR = acc('Accounts Receivable');
      const SALES = acc('Sales Revenue');
      const GST = acc('GST Output Payable');

      /* --------------------------------
       * 5️⃣ ACCOUNT TRANSACTION HEADER
       * -------------------------------- */
      const transaction = qr.manager.create(AccountTransaction, {
        referenceType: 'SALES_INVOICE',
        referenceId: savedInvoice.id,
        accountId: savedInvoice.id,

        voucher_no: `SI-${Date.now()}`,
        voucher_amount: savedInvoice.totalAmount,
        description: `Sales Invoice ${savedInvoice.invoiceNumber}`,
        transactionDate: savedInvoice.invoiceDate,
        createdBy: userId,
      });

      const savedTxn = await qr.manager.save(transaction);

      /* --------------------------------
       * 6️⃣ DOUBLE ENTRY (GST PAYABLE)
       * -------------------------------- */
      const glLines = [
        // Accounts Receivable (DR)
        {
          accountId: savedInvoice.id,
          accountType: AR,
          debit: savedInvoice.totalAmount,
          credit: 0,
          description: 'Customer Receivable',
        },
        // Sales Revenue (CR)
        {
          accountId: savedInvoice.id,

          accountType: SALES,
          debit: 0,
          credit: savedInvoice.totalAmount - savedInvoice.taxAmount,
          description: 'Sales Revenue',
        },
        // GST Output Payable (CR)
        {
          accountId: savedInvoice.id,

          accountType: GST,
          debit: 0,
          credit: savedInvoice.taxAmount,
          description: 'GST Output Payable',
        },
      ];
      const txnDetails = glLines.map(l =>
        qr.manager.create(AccountTransactionDetail, {
          transaction: savedTxn,
          accountId: l.accountId,
          accountType: { id: l.accountType.id },
          accountGroup: { id: l.accountType.group.id },
          debit: l.debit,
          credit: l.credit,
          description: l.description,
        }),
      );
      await qr.manager.save(txnDetails);
      await qr.commitTransaction();
      return savedInvoice;

    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // ===============================
  // FIND ALL
  // ===============================
  async findAll(): Promise<SalesInvoice[]> {
    return this.salesInvoiceRepo.find({
      where: { isDeleted: false },
      relations: ['customer', 'details', 'taxInvoices'],
      order: { invoiceDate: 'DESC' },
    });
  }

  // ===============================
  // FIND ONE
  // ===============================
  async findOne(id: string): Promise<SalesInvoice> {
    const invoice = await this.salesInvoiceRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['customer', 'details', 'taxInvoices'],
    });
    if (!invoice) throw new NotFoundException('Sales invoice not found');
    return invoice;
  }

  // ===============================
  // SOFT DELETE (REVERSIBLE)
  // ===============================
  async remove(id: string): Promise<void> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const invoice = await qr.manager.findOne(SalesInvoice, { where: { id } });
      if (!invoice) throw new NotFoundException('Invoice not found');

      invoice.isDeleted = true;
      await qr.manager.save(invoice);

      const txns = await qr.manager.find(AccountTransaction, {
        where: { id: id },
      });

      for (const t of txns) {
        t.isDeleted = true;
        await qr.manager.save(t);

        const lines = await qr.manager.find(AccountTransactionDetail, {
          where: { transaction: { id: t.id } },
        });
        lines.forEach(l => (l.isDeleted = true));
        await qr.manager.save(lines);
      }

      await qr.commitTransaction();
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }
}
