import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { PayrollDetail } from '../../payroll-details/entities/payroll-detail.entity';
import { SalarySlip } from '../../salaryslip/entities/salaryslip.entity';

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('payrolls')
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  payrollDate: Date;

  @Column({ type: 'enum', enum: PayrollStatus, default: PayrollStatus.DRAFT })
  status: PayrollStatus;


   @OneToMany(() => SalarySlip, slip => slip.payroll, {
    cascade: true,
  })
  salarySlips: SalarySlip[]
  @Column({ nullable: true })
  approvedBy: number;

  @Column({ nullable: true, type: 'timestamp' })
  approvedAt: Date;

  @Column({ nullable: true })
  remarks: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'integer', nullable: true })
  month: number;

  @Column({ type: 'integer', nullable: true })
  year: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalDeduction: number;
  
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalAllowance: number;

  @OneToMany(() => PayrollDetail, detail => detail.payroll, { cascade: true })
  details: PayrollDetail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
