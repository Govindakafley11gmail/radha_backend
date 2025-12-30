/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SalesInvoice } from '../../sales-invoice/entities/sales-invoice.entity';

@Entity()
export class SalesInvoiceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SalesInvoice, (invoice) => invoice.details, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sales_invoice_id' })
  salesInvoice: SalesInvoice;

  @Column({  nullable: false })
  productId: string;

  @Column({ type: 'varchar', length: 100 })
  productType: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  size?: string;

  @Column({ type: 'numeric', default: 0 })
  price: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'numeric', default: 0 })
  total: number;

  @Column({ default: false })
  isDeleted: boolean;
}