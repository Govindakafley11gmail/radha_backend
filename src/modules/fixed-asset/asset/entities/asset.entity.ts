import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'fixed_assets' })
export class FixedAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assetName: string;

  @Column()
  assetCode: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  purchaseCost: number;

  @Column({ nullable: true })
  gst: number;

  @Column({ type: 'date' })
  purchaseDate: Date;

  @Column({nullable: true, default: 'Pending'})
  status: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
