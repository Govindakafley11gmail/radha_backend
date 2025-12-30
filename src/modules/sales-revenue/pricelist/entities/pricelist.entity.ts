/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SalesInvoice } from 'src/modules/account_receivable/sales-invoice/entities/sales-invoice.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('price_list')
export class PriceList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_type: string;

  @Column()
  size: string;

  @Column('numeric', { precision: 15, scale: 2 })
  price: number;

  @Column({ default: false })
  isDeleted: boolean;

  // Optional: link to SalesInvoice if needed
  @ManyToOne(() => SalesInvoice, invoice => invoice.priceLists)
  salesInvoice: SalesInvoice;

}
