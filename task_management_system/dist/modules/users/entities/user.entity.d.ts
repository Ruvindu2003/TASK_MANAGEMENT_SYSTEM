import { type Relation } from 'typeorm';
import type { Task } from '../../tasks/entities/task.entity.js';
import type { Category } from '../../categories/entities/category.entity.js';
export declare class User {
    id: string;
    firebaseUid: string;
    email: string;
    displayName: string;
    photoUrl: string;
    tasks: Relation<Task>[];
    categories: Relation<Category>[];
    createdAt: Date;
    updatedAt: Date;
}
