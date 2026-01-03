import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Machine } from '../../machine/entities/machine.entity';
import { ProductionBatch } from '../../production-batch/entities/production-batch.entity';

@Entity('machine_usage_costs')
@Index(['machine', 'batch'])
export class MachineUsageCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Machine reference
  @ManyToOne(() => Machine, (machine) => machine.usageCosts, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  // Production batch reference (UUID)
  @ManyToOne(() => ProductionBatch, (batch) => batch.machineUsageCosts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: ProductionBatch;

  @Column('decimal', { precision: 10, scale: 2 })
  hoursUsed: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  operatingCost: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  maintenanceCost: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  depreciation: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  powerCost: number;

  @CreateDateColumn()
  transactionDate: Date;
}
