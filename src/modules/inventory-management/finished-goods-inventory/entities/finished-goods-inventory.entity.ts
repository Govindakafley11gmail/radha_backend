import { ProductUnitCost } from 'src/modules/cost-accounting/ProductionCosting/product-unit-cost/entities/product-unit-cost.entity';
import { ProductionBatch } from 'src/modules/cost-accounting/ProductionCosting/production-batch/entities/production-batch.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class FinishedGoodsInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productType: string;

  @Column({ type: 'decimal', default: 0 })
  quantityOnHand: number;

  @Column({ type: 'decimal', default: 0 })
  value: number;

  @Column({ type: 'decimal', default: 0 })
  damagedQuantity: number;

  @Column({ type: 'decimal', default: 0 })
  writeOffAmount: number;

  @ManyToOne(() => ProductionBatch, { eager: true })
  @JoinColumn({ name: 'productionBatchId' })
  productionBatch: ProductionBatch;

  @ManyToOne(() => ProductUnitCost, { eager: true })
  @JoinColumn({ name: 'productUnitCostId' })
  productUnitCost: ProductUnitCost;

  @Column()
  createdBy: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
