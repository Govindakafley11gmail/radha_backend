import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Payroll } from '../../payroll/entities/payroll.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';

@Entity('payroll_details')
export class PayrollDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Payroll, payroll => payroll.details)
    @JoinColumn({ name: 'payrollId' })
    payroll: Payroll;

    @Column()
    payrollId: string;
    @Column()

    housingAllowance: number;
    @Column()

    providentFund: number;
    @Column()

    otherAllowance: number;
    @Column()
    employeeId: number;

    @Column('decimal', { precision: 10, scale: 2 })
    basicSalary: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    allowances: number;


    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    deductions: number;

    @Column('decimal', { precision: 10, scale: 2 })
    netSalary: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    tds: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    medical: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    providentInterest: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'employeeId' })
    employee: User;
}
