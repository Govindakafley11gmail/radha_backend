/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AccountGroup } from '../../account_group/entities/account_group.entity';

@Entity('account_types')
export class AccountType {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    code?: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => AccountGroup, (group) => group.accountTypes, { nullable: false })
    @JoinColumn({ name: 'groupId' })
    group: AccountGroup; // ✅ type explicitly set

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
