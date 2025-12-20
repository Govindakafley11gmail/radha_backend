import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type BlogContentSection = {
  type: 'text' | 'image' | 'video';
  value: string; // text content or image/video URL
};

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  author?: string;

  @Column({ nullable: true })
  summary?: string;

  @Column({ type: 'json', nullable: true })
  contentSections: BlogContentSection[]; // multiple content sections

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
