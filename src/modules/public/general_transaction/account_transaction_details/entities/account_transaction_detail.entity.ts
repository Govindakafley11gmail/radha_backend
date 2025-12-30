/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { AccountTransaction } from '../../account_transaction/entities/account_transaction.entity';
import { AccountGroup } from 'src/modules/master/account_group/entities/account_group.entity';
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';
import { Payment } from 'src/modules/accounts/payment/entities/payment.entity';


@Entity('account_transaction_details')
export class AccountTransactionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccountTransaction, transaction => transaction.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: AccountTransaction;


  @Column({ type: 'varchar', length: 100, nullable: true })
  reference_no?: string;

  @Column()
  accountId: string; // The GL account affected in this line item

  // ---------------- Account Group ----------------
  @ManyToOne(() => AccountGroup)
  @JoinColumn({ name: 'account_group_id' })
  accountGroup?: AccountGroup;


  // ---------------- Account Type ----------------
  @ManyToOne(() => AccountType)
  @JoinColumn({ name: 'account_type_id' })
  accountType?: AccountType;


  @Column({ type: 'decimal', precision: 15, scale: 2 })
  debit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  credit: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description?: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
@ManyToOne(() => PurchaseInvoice, invoice => invoice.details, { nullable: true })
@JoinColumn({ name: 'purchase_invoice_id' })
purchaseInvoice?: PurchaseInvoice;

@ManyToOne(() => Payment, payment => payment.details, { nullable: true })
  @JoinColumn({ name: 'payment_id' })
  payment?: Payment;
}

