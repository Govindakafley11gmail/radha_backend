import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AccountTransactionDetail } from '../../account_transaction_details/entities/account_transaction_detail.entity';
import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';

@Entity('account_transactions')
export class AccountTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    accountId: string;

    @Column({ type: 'varchar', length: 50 })
    voucher_no: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    voucher_amount: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    reference_no?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'date' })
    transactionDate: Date;

    @Column({  nullable: true })
    createdBy: number;

    @Column({ type: 'varchar',  nullable: true })
    updatedBy?: string;

    
    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // ---------------- Relation to transaction details ----------------
    @OneToMany(() => PurchaseInvoice, invoice => invoice.transaction)
    purchaseInvoices: PurchaseInvoice[];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @OneToMany(() => AccountTransactionDetail, detail => detail.transaction, { cascade: true })
    details: AccountTransactionDetail[];
}
