import { TaskStatus, TaskPriority } from '../entities/task.entity.js';
export declare class TaskQueryDto {
    status?: TaskStatus;
    priority?: TaskPriority;
    categoryId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
