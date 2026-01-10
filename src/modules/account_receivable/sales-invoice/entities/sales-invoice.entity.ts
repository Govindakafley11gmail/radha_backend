/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { SalesInvoiceDetail } from '../../sales-invoice-details/entities/sales-invoice-detail.entity';
// import { TaxInvoice } from 'src/modules/taxation-compliance/taxinvoice/entities/taxinvoice.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';
import { PriceList } from 'src/modules/sales-revenue/pricelist/entities/pricelist.entity';
import { SalesReturn } from 'src/modules/sales-revenue/sales-return/entities/sales-return.entity';
import { TaxInvoice } from 'src/modules/taxation-compliance/taxinvoice/entities/taxinvoice.entity';

@Entity()
export class SalesInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.invoices, { nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  invoiceNumber: string;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @Column('numeric', { default: 0 })
  totalAmount: number;

  @Column('numeric', { default: 0 })
  taxAmount: number;

  @Column({ default: 'Pending' })
  status: string;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => SalesInvoiceDetail, (detail) => detail.salesInvoice, { cascade: true })
  details: SalesInvoiceDetail[];

  @OneToMany(() => TaxInvoice, (tax) => tax.salesInvoice, { cascade: true })
  taxInvoices?: TaxInvoice[];


  @OneToMany(() => Receipt, receipt => receipt.salesInvoice)
  receipts: Receipt[];

  @OneToMany(() => PriceList, priceList => priceList.salesInvoice)
  priceLists: PriceList[];

  @OneToMany(() => SalesReturn, salesReturn => salesReturn.salesInvoice)
  salesReturns: SalesReturn[];
}
