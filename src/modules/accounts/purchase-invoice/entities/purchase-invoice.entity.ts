import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Supplier } from '../../supplier/entities/supplier.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { PurchaseInvoiceDetail } from '../../purchaseinvoicedetails/entities/purchaseinvoicedetail.entity';
// import { TaxInvoice } from 'src/modules/taxation-compliance/taxinvoice/entities/taxinvoice.entity';
export enum MaterialType {
  NEW = 'NEW',
  SCRAP = 'SCRAP',
}


@Entity('purchase_invoices')
export class PurchaseInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoiceNo: string;

@Column({
  type: 'enum',
  enum: MaterialType,
})
materialTypes: MaterialType;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  freightCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  importDuty: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  scrapCost: number; // optional field if you want to track scrap value

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  materialCost: number; // sum of product totals without tax or charges

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherCharges: number; // freight + duty etc.

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  finalCost: number; // materialCost + tax + otherCharges

  @ManyToOne(() => Supplier, supplier => supplier.purchaseInvoices)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column()
  supplierId: string;
  
  @OneToMany(
    () => PurchaseInvoiceDetail,
    detail => detail.purchaseInvoice, // links to the property in PurchaseInvoiceDetail
    { cascade: true }
  )
  purchaseInvoiceDetails?: PurchaseInvoiceDetail[];


  @ManyToOne(() => AccountTransaction, transaction => transaction.purchaseInvoices, { cascade: true, nullable: true })
  @JoinColumn({ name: 'transaction_id' })
  transaction?: AccountTransaction;

  @OneToMany(() => AccountTransactionDetail, detail => detail.purchaseInvoice)
  details?: AccountTransactionDetail[];

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  taxAmount?: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  invoiceFile?: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending', nullable: true })
  status?: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, payment => payment.invoice)
  payments?: Payment[];
}

