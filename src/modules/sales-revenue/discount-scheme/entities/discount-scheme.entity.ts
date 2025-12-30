import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

@Entity('discount_scheme')
export class DiscountScheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_type: string;

  @Column({ type: 'enum', enum: DiscountType })
  discount_type: DiscountType;

  @Column('numeric', { precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'date' })
  valid_from: Date;

  @Column({ type: 'date' })
  valid_to: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
