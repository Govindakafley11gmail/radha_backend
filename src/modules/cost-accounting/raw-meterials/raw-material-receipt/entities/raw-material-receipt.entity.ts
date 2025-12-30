import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';
import { Supplier } from 'src/modules/accounts/supplier/entities/supplier.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { RawMaterial } from '../../raw-material/entities/raw-material.entity';
import { Payment } from 'src/modules/accounts/payment/entities/payment.entity';

@Entity()
export class RawMaterialReceipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Relations
    @ManyToOne(() => RawMaterial)
    @JoinColumn({ name: 'raw_material_id' })
    rawMaterial: RawMaterial;

    @OneToMany(() => Payment, (payment) => payment.rawMaterialReceipt)
    payments: Payment[];

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @ManyToOne(() => PurchaseInvoice)
    @JoinColumn({ name: 'purchase_invoice_id' })
    purchaseInvoice: PurchaseInvoice;

    // Fields
    @Column('decimal')
    quantityReceived: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    receivedDate: Date;

    @Column('decimal')
    total_unit_cost: number;

    @Column('decimal', { nullable: true })
    freightCost: number;

    @Column('decimal', { nullable: true })
    importDuty: number;

    @Column('decimal', { nullable: true })
    scrapQuantity: number;

    @Column('decimal')
    totalCost: number; // Can be computed as (quantityReceived * unitCost + freightCost + importDuty - scrapValue)

    @Column({ type: 'text', nullable: true })
    remarks?: string;

    @Column({ type: 'decimal', nullable: true })
    gst_tax_amount: number;

    @Column({ type: 'boolean', default: false })
    is_deleted: boolean;

    @Column({ nullable: true })
    receipt_no: string;


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
