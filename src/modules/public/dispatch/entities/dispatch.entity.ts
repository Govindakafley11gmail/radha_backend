import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('dispatches')
export class Dispatch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    dispatchNo: string; // RADHA/2026/0001

    // ✅ AUTO INCREMENT
    @Column({
        type: 'int',
        generated: 'increment',
        unique: true,
    })
    versionNo: number;

    @Column({ type: 'date' })
    dispatchDate: Date;

    @Column({ type: 'text', nullable: true })
    remarks?: string;

    @Column({ type: 'text', nullable: true })
    bank?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
