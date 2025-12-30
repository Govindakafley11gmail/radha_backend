// labor.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { LaborCost } from '../../labor-cost/entities/labor-cost.entity';

export enum LaborType {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
}

@Entity('labors')
export class Labor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: LaborType,
  })
  type: LaborType;

  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @OneToMany(
    () => LaborCost,
    (cost) => cost.labor,
  )
  laborCosts: LaborCost[];
}
