import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskQueryDto } from './dto/task-query.dto.js';
import { TaskStatus } from './entities/task.entity.js';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(userId: string, query: TaskQueryDto): Promise<import("./entities/task.entity.js").Task[]>;
    findOne(id: string, userId: string): Promise<import("./entities/task.entity.js").Task>;
    create(userId: string, createTaskDto: CreateTaskDto): Promise<import("./entities/task.entity.js").Task>;
    update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<import("./entities/task.entity.js").Task>;
    updateStatus(id: string, userId: string, status: TaskStatus): Promise<import("./entities/task.entity.js").Task>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
