import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MachineUsageCost } from '../../machine-cost/entities/machine-cost.entity';

export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DECLINING_BALANCE = 'DECLINING_BALANCE',
}

@Entity('machines')
export class Machine {
  depreciationAccountId(id: string, arg1: string, id1: string, depreciationAccountId: any, depreciation: number, arg5: number) {
    throw new Error('Method not implemented.');
  }
  powerAccountId(id: string, arg1: string, id1: string, powerAccountId: any, powerCost: number, arg5: number) {
    throw new Error('Method not implemented.');
  }
  maintenanceAccountId(id: string, arg1: string, id1: string, maintenanceAccountId: any, maintenanceCost: number, arg5: number) {
    throw new Error('Method not implemented.');
  }
  operatingExpenseAccountId(id: string, arg1: string, id1: string, operatingExpenseAccountId: any, operatingCost: number, arg5: number) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  usefulLife: number; // in years, typically

  // Use TypeORM decorators for automatic timestamps
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => MachineUsageCost,
    (usage) => usage.machine,
    { cascade: true },
  )
  usageCosts: MachineUsageCost[];
}
