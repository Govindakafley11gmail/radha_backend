import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OtherProductionCost } from '../../other-production-cost/entities/other-production-cost.entity';
import { LaborCost } from '../../labor-cost/entities/labor-cost.entity';
import { MachineUsageCost } from '../../machine-cost/entities/machine-cost.entity';

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

  // Machine usage costs
  @OneToMany(() => MachineUsageCost, (usage) => usage.batch)
  machineUsageCosts: MachineUsageCost[];

  // Labor costs
  @OneToMany(() => LaborCost, (cost) => cost.batch)
  laborCosts: LaborCost[];

  // Other production costs (overheads)
  @OneToMany(() => OtherProductionCost, (cost) => cost.batch)
  otherProductionCosts: OtherProductionCost[];
}
