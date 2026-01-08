import { PurchaseInvoice } from 'src/modules/accounts/purchase-invoice/entities/purchase-invoice.entity';
import { Supplier } from 'src/modules/accounts/supplier/entities/supplier.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { RawMaterial } from '../../raw-material/entities/raw-material.entity';
import { Payment } from 'src/modules/accounts/payment/entities/payment.entity';
import { RawMaterialInventory } from 'src/modules/inventory-management/raw-material-inventory/entities/raw-material-inventory.entity';

@Entity()
export class RawMaterialReceipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Relations
    // @ManyToOne(() => RawMaterial)
    // @JoinColumn({ name: 'raw_material_id' })
    // rawMaterial: RawMaterial;

    @OneToMany(() => Payment, (payment) => payment.rawMaterialReceipt)
    payments: Payment[];

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @ManyToOne(() => PurchaseInvoice)
    @JoinColumn({ name: 'purchase_invoice_id' })
    purchaseInvoice: PurchaseInvoice;

    @Column({ type: 'text', nullable: true })
    payment_remarks?: string;
    @Column({ type: 'timestamp',nullable: true})

    received_date:Date;

    @Column({ type: 'boolean', default: false })
    is_deleted: boolean;

    @Column({ nullable: true })
    receipt_no: string;


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ nullable: true })
    documentPath?: string;

    @Column({nullable: true})
    status: string;

    @ManyToOne(() => RawMaterialInventory, (inventory) => inventory.receipts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'inventory_id' })
    inventory: RawMaterialInventory;

    //   @OneToMany(
    //     () => PurchaseInvoiceDetail,
    //     detail => detail.purchaseInvoice, // links to the property in PurchaseInvoiceDetail
    //     { cascade: true }
    //   )
    //   purchaseInvoiceDetails?: PurchaseInvoiceDetail[];
}
