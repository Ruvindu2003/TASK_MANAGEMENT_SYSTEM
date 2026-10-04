import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity.js';
export interface TaskSummary {
    total: number;
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
    overdue: number;
    highPriority: number;
    completionRate: number;
}
export declare class AnalyticsService {
    private readonly tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    getSummary(userId: string): Promise<TaskSummary>;
}
