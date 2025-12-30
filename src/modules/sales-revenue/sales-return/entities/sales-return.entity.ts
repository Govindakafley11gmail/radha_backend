import { SalesInvoice } from 'src/modules/account_receivable/sales-invoice/entities/sales-invoice.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity('sales_return')
export class SalesReturn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SalesInvoice, invoice => invoice.salesReturns)
  @JoinColumn({ name: 'sales_invoice_id' })
  salesInvoice: SalesInvoice;

  @Column({ type: 'date' })
  return_date: Date;

  @Column('numeric', { precision: 15, scale: 2 })
  quantity: number;

  @Column('numeric', { precision: 15, scale: 2 })
  amount: number;

    @Column({ default: false })
    isDeleted: boolean;

}
