/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Payment, PaymentMode, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { PurchaseInvoice } from '../purchase-invoice/entities/purchase-invoice.entity';
import { Dispatch } from 'src/modules/public/dispatch/entities/dispatch.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async create(dto: CreatePaymentDto, userId:number): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Fetch Invoice
      const invoice = await queryRunner.manager.findOne(PurchaseInvoice, {
        where: { id: dto.invoiceId, isDeleted: false },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');
      if (invoice.status == 'Completed')
        throw new InternalServerErrorException('Only POSTED invoices can be paid');

      // 2️⃣ Fetch Ledger Accounts
      const accountsPayable = await queryRunner.manager.findOne(AccountType, {
        where: { name: 'Accounts Payable' },
        relations: ['group'],
      });

      const cashOrBank = await queryRunner.manager.findOne(AccountType, {
        where: {
          name: dto.paymentMode === PaymentMode.CASH ? 'Cash' : 'Bank',
        },
        relations: ['group'],
      });

      const gstInput = await queryRunner.manager.findOne(AccountType, {
        where: { name: 'GST Input' }, // GST receivable account
        relations: ['group'],
      });

      if (!accountsPayable || !cashOrBank || !gstInput)
        throw new InternalServerErrorException('Ledger accounts not properly configured');


      const payment = await queryRunner.manager.findOne(Payment, {
        where: { id: dto.id },
        relations: ['invoice', 'accountType', 'details'],
      });

      if (!payment) {
        throw new NotFoundException(`Payment with ID not found`);
      }
      payment.amount = dto.amount ?? payment.amount;
      payment.paymentDate = dto.paymentDate ?? payment.paymentDate;
      payment.paymentMode = dto.paymentMode ?? payment.paymentMode;
      payment.referenceNumber = dto.referenceNumber ?? payment.referenceNumber;
      payment.description = dto.description ?? payment.description;
      payment.accountType = cashOrBank;
      payment.status = PaymentStatus.COMPLETED

    const updatedPayment=  await queryRunner.manager.save(payment);
    
      const lastDispatch = await queryRunner.manager
        .createQueryBuilder(Dispatch, 'dispatch')
        .orderBy('dispatch.versionNo', 'DESC')
        .getOne();

      const versionNo = lastDispatch ? lastDispatch.versionNo + 1 : 1;
      const dispatchNo = `RADHA/${new Date().getFullYear()}/PV/${String(versionNo).padStart(4, '0')}`;

      // 3️⃣ Create dispatch entity
      const dispatchEntity = queryRunner.manager.create(Dispatch, {
        dispatchDate: dto.paymentDate,
        remarks: dto.description,
        versionNo,    // ✅ required
        dispatchNo,   // ✅ required
      });
      await queryRunner.manager.save(dispatchEntity);

      // 4️⃣ Create AccountTransaction (Voucher)
      const transaction = queryRunner.manager.create(AccountTransaction, {
        voucher_no: `PAY-${Date.now()}`,
        voucher_amount: dto.amount,
        referenceNo: invoice.id,
        description: `Payment for Purchase Invoice ${invoice.invoiceNo}`,
        transactionDate: dto.paymentDate,
        createdBy: userId,
        accountId: dto.id,
      });
      const savedTransaction = await queryRunner.manager.save(transaction);

      // 5️⃣ Calculate GST & Base Amount

      // 6️⃣ Create Transaction Details (Double Entry)
      const transactionDetails = [
        // Debit Accounts Payable
        queryRunner.manager.create(AccountTransactionDetail, {
          transaction: savedTransaction,
          accountType: accountsPayable,
          accountGroup: accountsPayable.group,
          debit: dto.amount,
          credit: 0,
          description: 'Supplier payment settlement',
          accountId: dto.id,
        }),

        // Credit Cash/Bank (Base Amount)
        queryRunner.manager.create(AccountTransactionDetail, {
          transaction: savedTransaction,
          accountType: cashOrBank,
          accountGroup: cashOrBank.group,
          debit: 0,
          credit: dto.amount,
          description: `${cashOrBank.name} payment`,
          accountId: dto.id,
        }),

        // // Credit GST Input (Receivable)
        // queryRunner.manager.create(AccountTransactionDetail, {
        //   transaction: savedTransaction,
        //   accountType: gstInput,
        //   accountGroup: gstInput.group,
        //   debit: 0,
        //   credit: gstAmount,
        //   description: 'GST Input (Receivable)',
        //   accountId: dto.id,

        // }),
      ];
      await queryRunner.manager.save(transactionDetails);

      // 7️⃣ Update Invoice Status if fully paid
      if (dto.amount >= invoice.finalCost) {
        invoice.status = 'Paid';
        await queryRunner.manager.save(invoice);
      }

      await queryRunner.commitTransaction();
      return updatedPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async update(id: string, dto: Partial<CreatePaymentDto>): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    let transactionStarted = false;

    try {
      // 1️⃣ Find the existing payment
      const payment = await queryRunner.manager.findOne(Payment, {
        where: { id },
        relations: ['invoice', 'accountType', 'details'],
      });

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      // 2️⃣ Fetch Ledger Accounts if paymentMode changes
      // if (dto.paymentMode && dto.paymentMode !== payment.paymentMode) {
      const cashOrBank = await queryRunner.manager.findOne(AccountType, {
        where: { name: dto.paymentMode === PaymentMode.CASH ? 'Cash' : 'Bank' },
        relations: ['group'],
      });
      if (!cashOrBank) throw new InternalServerErrorException('Ledger account not found');
      // }

      // 3️⃣ Start Transaction
      await queryRunner.startTransaction();
      transactionStarted = true;

      // 4️⃣ Update payment fields
      payment.amount = dto.amount ?? payment.amount;
      payment.paymentDate = dto.paymentDate ?? payment.paymentDate;
      payment.paymentMode = dto.paymentMode ?? payment.paymentMode;
      payment.referenceNumber = dto.referenceNumber ?? payment.referenceNumber;
      payment.description = dto.description ?? payment.description;
      payment.accountType = cashOrBank;

      const updatedPayment = await queryRunner.manager.save(payment);

      // 5️⃣ Update associated AccountTransaction

      // 7️⃣ Commit
      await queryRunner.commitTransaction();
      return updatedPayment;
    } catch (error) {
      if (transactionStarted) await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }



async findAll(params: any = {}) {
  const {
    referenceNumber,
    paymentMode,
    amountFrom,
    amountTo,
    dateFrom,
    dateTo,
    invoiceId,
    page = 1,
    limit = 10,
  } = params;

  const skip = (page - 1) * limit;

  const query = this.dataSource
    .getRepository(Payment)
    .createQueryBuilder('payment')
    .leftJoinAndSelect('payment.invoice', 'invoice')
    .leftJoinAndSelect('payment.supplier', 'supplier')
    .leftJoinAndSelect('payment.rawMaterialReceipt', 'rawMaterialReceipt')
    // ✅ FORCE pending
    .where('payment.status = :status', {
      status: PaymentStatus.PENDING,
    });

  if (referenceNumber) {
    query.andWhere('payment.referenceNumber ILIKE :ref', {
      ref: `%${referenceNumber}%`,
    });
  }

  if (paymentMode) {
    const modes = Array.isArray(paymentMode) ? paymentMode : [paymentMode];
    query.andWhere('payment.paymentMode IN (:...modes)', { modes });
  }

  if (amountFrom !== undefined || amountTo !== undefined) {
    if (amountFrom !== undefined && amountTo !== undefined) {
      query.andWhere('payment.amount BETWEEN :amountFrom AND :amountTo', {
        amountFrom,
        amountTo,
      });
    } else if (amountFrom !== undefined) {
      query.andWhere('payment.amount >= :amountFrom', { amountFrom });
    } else {
      query.andWhere('payment.amount <= :amountTo', { amountTo });
    }
  }

  if (dateFrom || dateTo) {
    query.andWhere('payment.paymentDate BETWEEN :dateFrom AND :dateTo', {
      dateFrom: dateFrom || '1900-01-01',
      dateTo: dateTo || '9999-12-31',
    });
  }

  if (invoiceId) {
    query.andWhere('invoice.id = :invoiceId', { invoiceId });
  }

  query
    .orderBy('payment.paymentDate', 'DESC')
    .skip(skip)
    .take(limit);

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

  async findOne(id: string): Promise<Payment> {
    const payment = await this.dataSource
      .getRepository(Payment)
      .findOne({
        where: { id },
        relations: ['invoice', 'accountType', 'details'],
      });

    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }

    return payment;
  }

  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Soft delete the payment
      const payment = await queryRunner.manager.findOne(Payment, { where: { id } });
      if (!payment) throw new NotFoundException(`Payment with ID ${id} not found`);

      payment.isDeleted = true;
      await queryRunner.manager.save(payment);

      // 2️⃣ Soft delete associated AccountTransaction
      const transaction = await queryRunner.manager.findOne(AccountTransaction, {
        where: { accountId: id.toString() },
      });
      if (transaction) {
        transaction.isDeleted = true;
        await queryRunner.manager.save(transaction);
      }
      // 3️⃣ Soft delete associated AccountTransactionDetail
      const details = await queryRunner.manager.find(AccountTransactionDetail, {
        where: { accountId: id.toString() },
      });
      if (details.length > 0) {
        details.forEach(d => (d.isDeleted = true));
        await queryRunner.manager.save(details);
      }

      await queryRunner.commitTransaction();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to delete payment');
    } finally {
      await queryRunner.release();
    }
  }
}