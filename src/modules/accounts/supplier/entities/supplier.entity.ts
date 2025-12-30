import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany
} from 'typeorm';
import { PurchaseInvoice } from '../../purchase-invoice/entities/purchase-invoice.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  supplier_id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  phone_no?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  gender?: string; // e.g., 'Male', 'Female', 'Other'

  @Column({ nullable: true })
  nationality?: string;

  @Column({ nullable: true })
  cidNo?: string; // Citizenship ID

  @Column({ nullable: true })
  status?: string; // e.g., 'Active', 'Inactive'

  @Column({ nullable: true })
  paymentTerms?: string;

  @Column({ nullable: true })
  mouFile?: string; // store file path or URL

  @Column({ type: 'date', nullable: true })
  mouDate?: Date;

  @Column({ type: 'date', nullable: true })
  expireDate?: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => PurchaseInvoice, invoice => invoice.supplier)
  purchaseInvoices: PurchaseInvoice[];

  // @OneToMany(() => RawMaterialReceipt, receipt => receipt.supplier)
  // rawMaterialReceipts: RawMaterialReceipt[];
}
