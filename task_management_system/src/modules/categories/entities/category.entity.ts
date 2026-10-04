import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  type Relation,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { Task } from '../../tasks/entities/task.entity.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 30, default: '#3B82F6' })
  color: string;

  @ManyToOne('User', 'categories', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToMany('Task', 'category')
  tasks: Relation<Task>[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
