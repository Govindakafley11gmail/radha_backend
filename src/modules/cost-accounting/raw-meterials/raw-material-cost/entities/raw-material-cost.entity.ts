import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RawMaterial } from '../../raw-material/entities/raw-material.entity';
import { ProductionBatch } from 'src/modules/cost-accounting/ProductionCosting/production-batch/entities/production-batch.entity';

@Entity()
export class RawMaterialCost {
  @PrimaryGeneratedColumn()
  id: number;

  // Link to RawMaterial
  @ManyToOne(() => RawMaterial, { eager: true })
  @JoinColumn({ name: 'raw_material_id' })
  rawMaterial: RawMaterial;

  
  @ManyToOne(() => ProductionBatch, (batch) => batch.rawMaterialCosts)
  batch: ProductionBatch;
  // Link to ProductionBatch
//   @ManyToOne(() => ProductionBatch, (batch) => batch.rawMaterialCosts, { eager: true })
//   @JoinColumn({ name: 'batch_id' })
//   batch: ProductionBatch;

  @Column('decimal')
  usedQuantity: number;

  @Column('decimal')
  costAmount: number; // usedQuantity * unit cost
}
