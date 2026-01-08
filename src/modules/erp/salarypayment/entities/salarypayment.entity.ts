import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payroll } from '../../payroll/entities/payroll.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';
import { SalarySlip } from '../../salaryslip/entities/salaryslip.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

@Entity('salary_payments')
export class SalaryPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* ---------------- RELATIONS ---------------- */
  @ManyToOne(() => Payroll, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payrollId' })
  payroll: Payroll;

  @Column({ type: 'uuid' })
  payrollId: string;

  @ManyToOne(() => SalarySlip, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salarySlipId' })
  salarySlip: SalarySlip;

  @Column({ type: 'uuid' })
  salarySlipId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: User;

  @Column({ type: 'uuid' })
  employeeId: string;

  /* ---------------- PAYMENT DETAILS ---------------- */
  @Column('decimal', { precision: 14, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMode: string; // e.g., BANK_TRANSFER, CASH, CHEQUE

  @Column({ type: 'varchar', length: 100, nullable: true })
  referenceNo: string; // transaction ID, cheque no, etc.

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  /* ---------------- METADATA ---------------- */
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
