import { ProductionBatch } from 'src/modules/cost-accounting/ProductionCosting/production-batch/entities/production-batch.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'wip_inventory' })
export class WIPInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductionBatch, (batch) => batch.wipInventories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch: ProductionBatch;
  

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  quantity: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  cost: number;
}
