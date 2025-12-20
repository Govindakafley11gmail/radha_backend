import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { Supplier } from '../../supplier/entities/supplier.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { AccountTransactionDetail } from 'src/modules/public/general_transaction/account_transaction_details/entities/account_transaction_detail.entity';

@Entity('purchase_invoices')
export class PurchaseInvoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    invoiceNo: string;

    @ManyToOne(() => Supplier, supplier => supplier.purchaseInvoices, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column()
    supplier_id: string;

    @ManyToOne(() => AccountTransaction, transaction => transaction.purchaseInvoices, { cascade: true, nullable: true })
    @JoinColumn({ name: 'transaction_id' })
    transaction?: AccountTransaction;

    @OneToMany(() => AccountTransactionDetail, detail => detail.purchaseInvoice)
    details?: AccountTransactionDetail[];

    @Column({ type: 'date' })
    invoiceDate: Date;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    totalAmount: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    taxAmount?: number;

    @Column({ type: 'varchar', length: 200, nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    invoiceFile?: string; // store file path or URL

    @Column({ type: 'varchar', length: 50, default: 'Pending', nullable: true })
    status?: string;

    // @Column({ type: 'varchar', length: 50 })
    // createdBy: string;

    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    payments: any;
}
