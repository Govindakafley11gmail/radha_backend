import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt: Date;


    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @ManyToMany(() => User, (user) => user.permissions)
    users: User[];

    @UpdateDateColumn()
    updatedAt: Date;
    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];
}
