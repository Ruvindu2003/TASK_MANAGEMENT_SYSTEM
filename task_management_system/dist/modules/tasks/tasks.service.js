var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity.js';
let TasksService = class TasksService {
    tasksRepository;
    constructor(tasksRepository) {
        this.tasksRepository = tasksRepository;
    }
    async findAll(userId, query) {
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
            qb.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${query.search.trim()}%` });
        }
        const sortColumn = query.sortBy ? `task.${query.sortBy}` : 'task.createdAt';
        const sortDirection = query.sortOrder && query.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        qb.orderBy(sortColumn, sortDirection);
        return await qb.getMany();
    }
    async findOne(id, userId) {
        const task = await this.tasksRepository.findOne({
            where: { id, userId },
            relations: { category: true },
        });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    async create(createTaskDto, userId) {
        const task = new Task();
        task.title = createTaskDto.title;
        task.description = createTaskDto.description || '';
        if (createTaskDto.status)
            task.status = createTaskDto.status;
        if (createTaskDto.priority)
            task.priority = createTaskDto.priority;
        task.dueDate = createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null;
        task.categoryId = createTaskDto.categoryId || null;
        task.userId = userId;
        const saved = await this.tasksRepository.save(task);
        return await this.findOne(saved.id, userId);
    }
    async update(id, updateTaskDto, userId) {
        const task = await this.findOne(id, userId);
        if (updateTaskDto.title !== undefined)
            task.title = updateTaskDto.title;
        if (updateTaskDto.description !== undefined)
            task.description = updateTaskDto.description;
        if (updateTaskDto.status !== undefined)
            task.status = updateTaskDto.status;
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
    async updateStatus(id, status, userId) {
        const task = await this.findOne(id, userId);
        task.status = status;
        await this.tasksRepository.save(task);
        return await this.findOne(id, userId);
    }
    async remove(id, userId) {
        const task = await this.findOne(id, userId);
        await this.tasksRepository.remove(task);
        return { deleted: true };
    }
};
TasksService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Task)),
    __metadata("design:paramtypes", [Repository])
], TasksService);
export { TasksService };
//# sourceMappingURL=tasks.service.js.map