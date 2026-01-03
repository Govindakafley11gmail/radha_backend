import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductionBatch } from '../../production-batch/entities/production-batch.entity';

@Entity('product_unit_costs')
export class ProductUnitCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Link to Production Batch
  @ManyToOne(() => ProductionBatch, (batch) => batch.productUnitCosts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: ProductionBatch;

  @Column('decimal', { precision: 15, scale: 2 })
  costPerKg: number;

  @Column('decimal', { precision: 15, scale: 2 })
  costPerBox: number;

  @Column('decimal', { precision: 15, scale: 2 })
  costPerNail: number;

  @Column('decimal', { precision: 15, scale: 2 })
  processCuttingCost: number;

  @Column('decimal', { precision: 15, scale: 2 })
  processHeadingCost: number;

  @Column('decimal', { precision: 15, scale: 2 })
  processPolishingCost: number;

  @Column('decimal', { precision: 15, scale: 2 })
  processPackingCost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
