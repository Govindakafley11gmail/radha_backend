import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseInvoice } from '../../purchase-invoice/entities/purchase-invoice.entity';

@Entity({ name: 'purchase_invoice_details' })
export class PurchaseInvoiceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => PurchaseInvoice, (invoice) => invoice.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_invoice_id' })
  purchaseInvoice: PurchaseInvoice;

  @Column()
  productId: string;

  @Column()
  productType: string;

  @Column({ nullable: true })
  size?: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column('decimal', { precision: 12, scale: 2 })
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  total?: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  taxAmount?: number;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
