import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { SalesInvoice } from '../../sales-invoice/entities/sales-invoice.entity';


@Entity()
export class BadDebt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, { nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => SalesInvoice, { nullable: false })
  @JoinColumn({ name: 'sales_invoice_id' })
  salesInvoice: SalesInvoice;

  @Column('numeric', { default: 0 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'date', nullable: true })
  write_off_date: string;
}
