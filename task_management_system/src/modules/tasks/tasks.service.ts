import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskQueryDto } from './dto/task-query.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async findAll(userId: string, query: TaskQueryDto): Promise<Task[]> {
    const qb = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .where('task.userId = :userId', { userId });

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }

    if (query.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }

    if (query.categoryId) {
      qb.andWhere('task.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    if (query.search && query.search.trim()) {
      qb.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${query.search.trim()}%` },
      );
    }

    const sortColumn = query.sortBy ? `task.${query.sortBy}` : 'task.createdAt';
    const sortDirection =
      query.sortOrder && query.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(sortColumn, sortDirection);

    return await qb.getMany();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, userId },
      relations: { category: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description || '';
    if (createTaskDto.status) task.status = createTaskDto.status;
    if (createTaskDto.priority) task.priority = createTaskDto.priority;
    task.dueDate = createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null;
    task.categoryId = createTaskDto.categoryId || null;
    task.userId = userId;

    const saved = await this.tasksRepository.save(task);
    return await this.findOne(saved.id, userId);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);

    if (updateTaskDto.title !== undefined) task.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined)
      task.description = updateTaskDto.description;
    if (updateTaskDto.status !== undefined) task.status = updateTaskDto.status;
    if (updateTaskDto.priority !== undefined)
      task.priority = updateTaskDto.priority;
    if (updateTaskDto.dueDate !== undefined) {
      task.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null;
    }
    if (updateTaskDto.categoryId !== undefined) {
      task.categoryId = updateTaskDto.categoryId || null;
    }

    await this.tasksRepository.save(task);
    return await this.findOne(id, userId);
  }

  async updateStatus(
    id: string,
    status: TaskStatus,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);
    task.status = status;
    await this.tasksRepository.save(task);
    return await this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<{ deleted: boolean }> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
    return { deleted: true };
  }
}
