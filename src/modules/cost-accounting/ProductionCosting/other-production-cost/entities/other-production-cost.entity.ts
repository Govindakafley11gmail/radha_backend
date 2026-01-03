// other-production-cost.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ProductionBatch } from '../../production-batch/entities/production-batch.entity';

export enum OverheadType {
  RENT = 'RENT',
  UTILITIES = 'UTILITIES',
  MAINTENANCE = 'MAINTENANCE',
  CONSUMABLES = 'CONSUMABLES',
  OTHER = 'OTHER',
}

@Entity('other_production_costs')
@Index(['batch', 'costType'])
export class OtherProductionCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ✅ Link to ProductionBatch
  @ManyToOne(
    () => ProductionBatch,
    (batch) => batch.otherProductionCosts,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'batch_id' })
  batch: ProductionBatch;

  @Column({
    type: 'enum',
    enum: OverheadType,
  })
  costType: OverheadType;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  amount: number;

  @CreateDateColumn()
  transactionDate: Date;
}
