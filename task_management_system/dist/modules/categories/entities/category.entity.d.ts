import { type Relation } from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { Task } from '../../tasks/entities/task.entity.js';
export declare class Category {
    id: string;
    name: string;
    color: string;
    user: Relation<User>;
    user_id: string;
    tasks: Relation<Task>[];
    createdAt: Date;
}
