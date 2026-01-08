import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Payroll } from '../../payroll/entities/payroll.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';

@Entity('salary_slips')
@Index(['payrollId', 'employeeId'], { unique: true }) // prevent duplicate slips
export class SalarySlip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* ---------------- RELATIONS ---------------- */

  @ManyToOne(() => Payroll, payroll => payroll.salarySlips, {
    onDelete: 'CASCADE',
  })
  payroll: Payroll;

  @Column({ type: 'uuid' })
  payrollId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  employee: User; // ✅ relation object

  @Column({ nullable:true })
  employeeId: number; // still keep the foreign key for queries

  /* ---------------- SALARY BREAKDOWN ---------------- */

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  allowances: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  deductions: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  netSalary: number;

  /* ---------------- STATUS ---------------- */

  @Column({
    type: 'enum',
    enum: ['GENERATED', 'PAID'],
    default: 'GENERATED',
  })
  status: 'GENERATED' | 'PAID';

  /* ---------------- METADATA ---------------- */

  @CreateDateColumn()
  generatedAt: Date;
}
