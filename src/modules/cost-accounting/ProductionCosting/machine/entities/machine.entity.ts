// machine.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { MachineUsageCost } from '../../machine-cost/entities/machine-cost.entity';

export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DECLINING_BALANCE = 'DECLINING_BALANCE',
}

@Entity('machines')
export class Machine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('decimal', { precision: 15, scale: 2 })
  purchaseCost: number;

  @Column({
    type: 'enum',
    enum: DepreciationMethod,
  })
  depreciationMethod: DepreciationMethod;

  @Column()
  usefulLife: number;

  @OneToMany(
    () => MachineUsageCost,
    (usage) => usage.machine,
  )
  usageCosts: MachineUsageCost[];
}
