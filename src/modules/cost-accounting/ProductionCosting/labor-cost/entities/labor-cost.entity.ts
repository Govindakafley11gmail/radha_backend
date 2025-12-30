import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Labor } from '../../labor/entities/labor.entity';
import { ProductionBatch } from '../../production-batch/entities/production-batch.entity';

@Entity('labor_costs')
export class LaborCost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Labor, (labor) => labor.laborCosts, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'labor_id' })
  labor: Labor;

  @ManyToOne(() => ProductionBatch, (batch) => batch.laborCosts, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch: ProductionBatch;

  @Column('decimal', { precision: 10, scale: 2 })
  hoursWorked: number;

  @Column('decimal', { precision: 15, scale: 2 })
  hourlyRateSnapshot: number;

  @Column('decimal', { precision: 15, scale: 2 })
  totalCost: number;

  @CreateDateColumn()
  transactionDate: Date;
}
