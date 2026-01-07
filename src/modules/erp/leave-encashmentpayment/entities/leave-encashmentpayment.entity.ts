import { User } from 'src/modules/authentication/users/entities/user.entity';
import { AccountTransaction } from 'src/modules/public/general_transaction/account_transaction/entities/account_transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LeaveEncashment } from '../../leave-encashment/entities/leave-encashment.entity';


export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('leave_encashment_payment')
export class LeaveEncashmentPayment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Link to the leave encashment request
  @ManyToOne(() => LeaveEncashment)
  @JoinColumn({ name: 'leave_encashment_id' })
  leaveEncashment: LeaveEncashment;

  @Column({nullable: true })
  leave_encashment_id: string;

  // Payment amount
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  // Payment date (actual payout date)
  @Column({ type: 'date', nullable: true })
  payment_date?: Date;

  // Status of the payment
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  // Optional link to accounting transaction
  @ManyToOne(() => AccountTransaction, { nullable: true })
  @JoinColumn({ name: 'account_transaction_id' })
  accountTransaction?: AccountTransaction;

  @Column({  nullable: true })
  account_transaction_id?: string;

  // Who processed the payment
  @ManyToOne(() => User)
  @JoinColumn({ name: 'processed_by_id' })
  processedBy: number;

  @Column({  nullable: true })
  processed_by_id?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
