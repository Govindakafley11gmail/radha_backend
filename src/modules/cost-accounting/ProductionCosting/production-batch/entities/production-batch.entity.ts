import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OtherProductionCost } from '../../other-production-cost/entities/other-production-cost.entity';
import { LaborCost } from '../../labor-cost/entities/labor-cost.entity';
import { MachineUsageCost } from '../../machine-cost/entities/machine-cost.entity';
import { RawMaterialCost } from 'src/modules/cost-accounting/raw-meterials/raw-material-cost/entities/raw-material-cost.entity';
import { ProductUnitCost } from '../../product-unit-cost/entities/product-unit-cost.entity';
import { WIPInventory } from 'src/modules/inventory-management/wipinventory/entities/wipinventory.entity';

@Entity({ name: 'production_batches' })
export class ProductionBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'batch_number', unique: true })
  batchNumber: string;

  @Column({ name: 'production_date', type: 'date' })
  productionDate: Date;

  @Column({ name: 'product_type' })
  productType: string;

  @Column({ name: 'quantity_produced', type: 'decimal', precision: 12, scale: 2 })
  quantityProduced: number;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string; // ✅ fixed missing decorator

  // --- Relations ---
  @OneToMany(() => WIPInventory, (wip) => wip.batch)
  wipInventories: WIPInventory[];

  @OneToMany(() => MachineUsageCost, (usage) => usage.batch)
  machineUsageCosts: MachineUsageCost[];

  @OneToMany(() => LaborCost, (cost) => cost.batch)
  laborCosts: LaborCost[];

  @OneToMany(() => OtherProductionCost, (cost) => cost.batch)
  otherProductionCosts: OtherProductionCost[];

  @OneToMany(() => RawMaterialCost, (cost) => cost.batch, { cascade: true })
  rawMaterialCosts: RawMaterialCost[];

  @OneToMany(() => ProductUnitCost, (unitCost) => unitCost.batch)
  productUnitCosts: ProductUnitCost[];
}
