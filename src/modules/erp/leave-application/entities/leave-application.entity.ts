import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { LeaveType } from '../../leave-types/entities/leave-type.entity';
import { User } from 'src/modules/authentication/users/entities/user.entity';


export enum LeaveStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity('leave_applications')
export class LeaveApplication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'employee_id' })
    employee: User;

    @ManyToOne(() => LeaveType, { eager: true })
    @JoinColumn({ name: 'leave_type_id' })
    leaveType: LeaveType;

    @Column({ type: 'date' })
    start_date: string;

    @Column({ type: 'date' })
    end_date: string;

    @Column({ type: 'int' })
    total_days: number;

    @Column({ type: 'text', nullable: true })
    reason?: string;

    @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
    status: LeaveStatus;

    @Column({  nullable: true })
    created_by: number;

    @Column({  nullable: true })
    approved_by: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
