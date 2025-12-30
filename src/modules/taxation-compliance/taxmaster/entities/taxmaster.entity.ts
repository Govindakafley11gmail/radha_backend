/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TaxType {
  VAT = 'VAT',
  GST = 'GST',
  EXCISE = 'EXCISE',
  TDS = 'TDS',
}

@Entity('tax_masters')
export class TaxMaster {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TaxType,
  })
  tax_type: TaxType;

  @Column('numeric')
  rate: number; // percentage

  @Column()
  applicable_on: string; // Sales / Purchase / Both

  @Column({ default: true })
  isActive: boolean;

}
