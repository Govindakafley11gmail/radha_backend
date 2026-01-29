import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FixedAsset } from '../../asset/entities/asset.entity';

@Entity({ name: 'asset_payments' })
export class AssetPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FixedAsset)
  @JoinColumn({ name: 'asset_id' })
  asset: FixedAsset;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  paymentMode?: string; // Cash, Bank, Cheque, etc.

  @Column({ nullable: true })
  description?: string;
  
  @Column({nullable: false})
  status: string;

  @Column({ type: 'date' })
  paymentDate: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
