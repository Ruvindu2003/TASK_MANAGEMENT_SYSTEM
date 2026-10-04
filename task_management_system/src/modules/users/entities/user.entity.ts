import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  type Relation,
} from 'typeorm';
import type { Task } from '../../tasks/entities/task.entity.js';
import type { Category } from '../../categories/entities/category.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 128 })
  firebaseUid: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  photoUrl: string;

  @OneToMany('Task', 'user')
  tasks: Relation<Task>[];

  @OneToMany('Category', 'user')
  categories: Relation<Category>[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
