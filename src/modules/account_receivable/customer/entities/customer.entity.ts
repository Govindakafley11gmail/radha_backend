import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BadDebt } from '../../bad-debt/entities/bad-debt.entity';
import { SalesInvoice } from '../../sales-invoice/entities/sales-invoice.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';


@Entity()
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    customer_id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    identification_no: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone_no: string;

    @Column({ nullable: true })
    tax_id: string;

    @Column('numeric', { default: 0 })
    credit_limit: number;

    @Column({ nullable: true })
    credit_terms: string;

    @OneToMany(() => SalesInvoice, (invoice) => invoice.customer)
    invoices: SalesInvoice[];

    @Column({ nullable: false, default: false })
    isDeleted: boolean;

    @OneToMany(() => BadDebt, (bd) => bd.customer)
    badDebts: BadDebt[];

    @OneToMany(() => Receipt, receipt => receipt.customer)
    receipts: Receipt[];
}
