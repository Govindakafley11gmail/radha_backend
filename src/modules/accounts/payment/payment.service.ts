/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { Payment, PaymentMode } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    dto: CreatePaymentDto,
  ): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Save Payment
      const payment = queryRunner.manager.create(Payment, {
        ...dto,
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // 2️⃣ Save Account Transaction (Header)
      const transaction = queryRunner.manager.create(AccountTransaction, {
        accountId: savedPayment.referenceNumber, // Adjust based on your logic
        voucher_no: `PAY-${Date.now().toString()}`,
        voucher_amount: savedPayment.amount,
        reference_no: savedPayment.referenceNumber || savedPayment.id.toString(),
        description: `Payment via ${savedPayment.paymentMode} - Ref: ${savedPayment.referenceNumber}`,
        transactionDate: savedPayment.paymentDate,
        createdBy: 'system', // Replace with actual user if available
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // 3️⃣ Fetch Cash and Bank Account Types (for credit side)
      const accountTypes = await queryRunner.manager.find(AccountType, {
        where: { name: In(['Cash', 'Bank']) },
        relations: ['group'],
      });

      const cashAccount = accountTypes.find((acc) => acc.name === 'Cash');
      const bankAccount = accountTypes.find((acc) => acc.name === 'Bank');

      const creditAccountType =
        savedPayment.paymentMode === PaymentMode.CASH ? cashAccount : bankAccount;

      if (!creditAccountType) {
        throw new InternalServerErrorException('Cash or Bank account type not found');
      }

      // 4️⃣ Save Transaction Details (Debit: Supplier/Expense, Credit: Cash/Bank)
      const details = queryRunner.manager.create(AccountTransactionDetail, [
        {
          transaction: savedTransaction,
          accountId: savedPayment.referenceNumber, // Typically supplier/party being paid
          debit: savedPayment.amount,
          credit: 0,
          description: 'Payment to supplier/party',
          accountType: { id: savedPayment.accountType?.id }, // Party's account type
          accountGroup: { id: savedPayment.accountType?.group?.id },
        },
        {
          transaction: savedTransaction,
          accountId: savedPayment.referenceNumber,
          debit: 0,
          credit: savedPayment.amount,
          description: `${savedPayment.paymentMode} payment outflow`,
          accountType: { id: creditAccountType.id },
          accountGroup: { id: creditAccountType.group.id },
        },
      ]);

      await queryRunner.manager.save(details);

      await queryRunner.commitTransaction();
      return savedPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error instanceof InternalServerErrorException
        ? error
        : new InternalServerErrorException('Failed to create payment', error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: any = {}): Promise<{
    data: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      referenceNumber,
      paymentMode,
      status,
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
      .leftJoinAndSelect('payment.accountType', 'accountType')
      .leftJoinAndSelect('payment.details', 'details');

    if (referenceNumber) {
      query.andWhere('payment.referenceNumber ILIKE :ref', {
        ref: `%${referenceNumber}%`,
      });
    }

    if (paymentMode) {
      const modes = Array.isArray(paymentMode) ? paymentMode : [paymentMode];
      query.andWhere('payment.paymentMode IN (:...modes)', { modes });
    }

    if (status) {
      const statuses = Array.isArray(status) ? status : [status];
      query.andWhere('payment.status IN (:...statuses)', { statuses });
    }

    if (amountFrom !== undefined || amountTo !== undefined) {
      if (amountFrom !== undefined && amountTo !== undefined) {
        query.andWhere('payment.amount BETWEEN :amountFrom AND :amountTo', {
          amountFrom,
          amountTo,
        });
      } else if (amountFrom !== undefined) {
        query.andWhere('payment.amount >= :amountFrom', { amountFrom });
      } else if (amountTo !== undefined) {
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
      .addOrderBy('payment.createdAt', 'DESC')
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

  async findOne(id: number): Promise<Payment> {
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

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.dataSource.getRepository(Payment).save(payment);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.dataSource.getRepository(Payment).remove(payment);
  }
}