import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RawMaterialCost } from '../../raw-material-cost/entities/raw-material-cost.entity';
import { RawMaterialReceipt } from '../../raw-material-receipt/entities/raw-material-receipt.entity';


@Entity()
export class RawMaterial {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    unit: string; // e.g., kg, liters, pieces

    @Column('decimal')
    standard_cost: number;

    // Relations
    @OneToMany(() => RawMaterialReceipt, (receipt) => receipt.rawMaterial)
    receipts: RawMaterialReceipt[];

    @OneToMany(() => RawMaterialCost, (cost) => cost.rawMaterial)
    costs: RawMaterialCost[];

    @Column({ type: 'text', nullable: true })
    description?: string; // optional field

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'boolean', default: false })
    is_deleted: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;


}
