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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from '../tasks/entities/task.entity.js';
let AnalyticsService = class AnalyticsService {
    tasksRepository;
    constructor(tasksRepository) {
        this.tasksRepository = tasksRepository;
    }
    async getSummary(userId) {
        const tasks = await this.tasksRepository.find({
            where: { userId },
        });
        const total = tasks.length;
        let todo = 0;
        let inProgress = 0;
        let inReview = 0;
        let done = 0;
        let overdue = 0;
        let highPriority = 0;
        const now = new Date();
        for (const task of tasks) {
            if (task.status === TaskStatus.TODO)
                todo++;
            else if (task.status === TaskStatus.IN_PROGRESS)
                inProgress++;
            else if (task.status === TaskStatus.IN_REVIEW)
                inReview++;
            else if (task.status === TaskStatus.DONE)
                done++;
            if (task.dueDate &&
                new Date(task.dueDate) < now &&
                task.status !== TaskStatus.DONE) {
                overdue++;
            }
            if (task.priority === TaskPriority.HIGH ||
                task.priority === TaskPriority.URGENT) {
                highPriority++;
            }
        }
        const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
        return {
            total,
            todo,
            inProgress,
            inReview,
            done,
            overdue,
            highPriority,
            completionRate,
        };
    }
};
AnalyticsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Task)),
    __metadata("design:paramtypes", [Repository])
], AnalyticsService);
export { AnalyticsService };
//# sourceMappingURL=analytics.service.js.map