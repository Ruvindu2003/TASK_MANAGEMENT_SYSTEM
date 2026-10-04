import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskQueryDto } from './dto/task-query.dto.js';
export declare class TasksService {
    private readonly tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    findAll(userId: string, query: TaskQueryDto): Promise<Task[]>;
    findOne(id: string, userId: string): Promise<Task>;
    create(createTaskDto: CreateTaskDto, userId: string): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task>;
    updateStatus(id: string, status: TaskStatus, userId: string): Promise<Task>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
