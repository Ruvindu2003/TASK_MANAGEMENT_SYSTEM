import { TaskStatus, TaskPriority } from '../entities/task.entity.js';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    categoryId?: string;
}
