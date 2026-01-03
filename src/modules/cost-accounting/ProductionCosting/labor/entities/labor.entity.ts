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

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

@Entity('labors')
export class Labor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  identificationNo: string;

  @Column({ unique: true })
  mobileNo: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column()
  age: number;

  @Column()
  dzongkhag: string; // Location/Dzongkhag

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
