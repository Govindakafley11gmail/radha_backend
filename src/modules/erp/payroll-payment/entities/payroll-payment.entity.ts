import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Payroll } from "../../payroll/entities/payroll.entity";

@Entity('payrolls-payments')
export class PayrollPayment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Payroll, (payroll) => payroll.payments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'payroll_id' })
    payroll!: Payroll;

    @Column()
    amount!: number;

    @Column()
    remarks!: string;
    @Column()
    paymentMethod!: string;
    @Column()
    chequeNo!: string;

    @Column({ type: 'date' })
    date!: Date;
    @Column()
    status!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}