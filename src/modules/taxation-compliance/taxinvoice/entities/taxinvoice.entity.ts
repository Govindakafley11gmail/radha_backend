/* eslint-disable @typescript-eslint/no-unsafe-return */
// import { SalesInvoice } from 'src/modules/account_receivable/sales-invoice/entities/sales-invoice.entity';
import { SalesInvoice } from 'src/modules/account_receivable/sales-invoice/entities/sales-invoice.entity';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  // ManyToOne,
  // JoinColumn,
} from 'typeorm';
// import { SalesInvoice } from 'src/modules/account_receivable/sales-invoice/entities/sales-invoice.entity';

@Entity('tax_invoices')
export class TaxInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SalesInvoice, (invoice) => invoice.taxInvoices, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sales_invoice_id' })
  salesInvoice?: SalesInvoice;

  // 🔹 INPUT TAX (Purchase)
  @ManyToOne(() => PurchaseInvoice, (invoice) => invoice.taxInvoices, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_invoice_id' })
  purchaseInvoice?: PurchaseInvoice;

  @Column()
  customerId: string;

  @Column()
  invoiceNumber: string;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column('numeric', { default: 0 })
  totalAmount: number;

  @Column('numeric', { default: 0 })
  taxAmount: number;

  @Column({ default: false })
  isDeleted: boolean;
}