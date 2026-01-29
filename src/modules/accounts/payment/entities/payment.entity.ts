/* eslint-disable @typescript-eslint/no-unsafe-return */
import { AccountType } from 'src/modules/master/account_types/entities/account_type.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';
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
import { PurchaseInvoice } from '../../purchase-invoice/entities/purchase-invoice.entity';
import { RawMaterialReceipt } from 'src/modules/cost-accounting/raw-meterials/raw-material-receipt/entities/raw-material-receipt.entity';
import { Supplier } from '../../supplier/entities/supplier.entity';

export enum PaymentStatus {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
    FAILED = 'Failed',
}

export enum PaymentMode {
    CASH = 'Cash',
    BANK = 'Bank',
    CHEQUE = 'Cheque',
    ONLINE = 'Online',
}

@Entity('payments') // <--- table name explicitly
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'date' })
    paymentDate: string;

    @Column({nullable: true})
    paymentMode: string;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @ManyToOne(() => PurchaseInvoice, (invoice) => invoice.payments, { nullable: false })
    invoice: PurchaseInvoice;

    @ManyToOne(() => AccountType)
    accountType: AccountType; // Cash or Bank account

    @Column({ nullable: true })
    referenceNumber: string; // cheque number, transaction ID, etc.
    @Column({ nullable: true })
    supplierId: string;

    @ManyToOne(() => Supplier, { nullable: true })
    @JoinColumn({ name: 'supplierId' })
    supplier: Supplier;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    accountNo: string;

    @OneToMany(() => AccountTransactionDetail, detail => detail.payment)
    details: AccountTransactionDetail[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(
        () => RawMaterialReceipt,
        (receipt) => receipt.payments,
        { nullable: true },
    )
    rawMaterialReceipt?: RawMaterialReceipt;
 

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ type: 'text', nullable: true })
    documentPath: string;
}
