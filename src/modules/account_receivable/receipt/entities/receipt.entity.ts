/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { SalesInvoice } from '../../sales-invoice/entities/sales-invoice.entity';

export enum ReceiptStatus {
    DRAFT = 'DRAFT',
    POSTED = 'POSTED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
    CASH = 'CASH',
    BANK = 'BANK',
    CHEQUE = 'CHEQUE',
    ONLINE = 'ONLINE',
}

// export function getPaymentAccount(method: PaymentMethod): string {
//     switch (method) {
//         case PaymentMethod.BANK:
//             return 'BANK_MAIN';

//         case PaymentMethod.CHEQUE:
//             return 'CHEQUE_CLEARING';

//         case PaymentMethod.ONLINE:
//             return 'ONLINE_RECEIPTS';

//         case PaymentMethod.CASH:
//         default:
//             return 'CASH_MAIN';
//     }
// }
@Entity('receipts')
export class Receipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column()
    receipt_number: string;

    // FK reference (soft link – no hard coupling)
    @Column({ type: 'uuid' })
    sales_invoice_id: string;

    @Column({ type: 'date' })
    receipt_date: Date;

    @Column('numeric', { precision: 15, scale: 2, default: 0 })
    amount_received: number;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.CASH,
    })
    payment_method: PaymentMethod;

    @Column({
        type: 'enum',
        enum: ReceiptStatus,
        default: ReceiptStatus.DRAFT,
    })
    status: ReceiptStatus;

    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Customer, { eager: false })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => SalesInvoice)
    @JoinColumn({ name: 'sales_invoice_id' })
    salesInvoice: SalesInvoice;
}
