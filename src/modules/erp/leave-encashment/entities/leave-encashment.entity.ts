import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from 'src/modules/authentication/users/entities/user.entity';

export enum EncashmentStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('leave_encashments')
export class LeaveEncashment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // The employee who requested the encashment
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  // Leave type ID for which encashment is requested
  @Column()
  leaveTypeId: string;

  @Column('int')
  days: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['PENDING', 'VERIFIED', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: EncashmentStatus;

  // Who created the request (employee)
  @Column({ nullable: true })

  createdBy?: number;

  // Who verified the request (HR)
   @Column({ nullable: true })

  verifiedBy?: number;

  // Who approved/paid the encashment
  @Column({ nullable: true })
  approvedBy?: number;

  @CreateDateColumn()
  created_at: Date;
}
