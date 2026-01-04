import { RawMaterialReceipt } from 'src/modules/cost-accounting/raw-meterials/raw-material-receipt/entities/raw-material-receipt.entity';
import { RawMaterial } from 'src/modules/cost-accounting/raw-meterials/raw-material/entities/raw-material.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

export enum ValuationMethod {
    FIFO = 'FIFO',
    WAC = 'WAC',
}

@Entity('raw_material_inventory')
export class RawMaterialInventory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // 🔗 One RawMaterial → One Inventory
    @OneToOne(() => RawMaterial, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'raw_material_id' })
    rawMaterial: RawMaterial;

    @Column({ type: 'uuid', unique: true })
    raw_material_id: string;

    @Column({
        type: 'numeric',
        precision: 12,
        scale: 3,
        default: 0,
    })
    quantity_on_hand: number;

    @Column({
        type: 'numeric',
        precision: 14,
        scale: 2,
        default: 0,
    })
    value: number;

    @Column({
        type: 'enum',
        enum: ValuationMethod,
        default: ValuationMethod.WAC,
    })
    valuation_method: ValuationMethod;

    @Column({
        type: 'numeric',
        precision: 12,
        scale: 3,
        default: 0,
    })
    reorder_level: number;


    @OneToMany(() => RawMaterialReceipt, (receipt) => receipt.inventory)
    receipts: RawMaterialReceipt[];

    @Column({ nullable: true })
    createdBy: number;
    @Column({ nullable: true })
    updatedBy: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
