import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { RawMaterialCost } from '../../raw-material-cost/entities/raw-material-cost.entity';
// import { RawMaterialReceipt } from '../../raw-material-receipt/entities/raw-material-receipt.entity';
import { RawMaterialInventory } from 'src/modules/inventory-management/raw-material-inventory/entities/raw-material-inventory.entity';


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
    // @OneToMany(() => RawMaterialReceipt, (receipt) => receipt.rawMaterial)
    // receipts: RawMaterialReceipt[];

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
  @OneToOne(() => RawMaterialInventory, (inventory) => inventory.rawMaterial)
  inventory: RawMaterialInventory;

}
