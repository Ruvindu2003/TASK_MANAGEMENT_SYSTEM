import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from '../tasks/entities/task.entity.js';

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

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async getSummary(userId: string): Promise<TaskSummary> {
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
      if (task.status === TaskStatus.TODO) todo++;
      else if (task.status === TaskStatus.IN_PROGRESS) inProgress++;
      else if (task.status === TaskStatus.IN_REVIEW) inReview++;
      else if (task.status === TaskStatus.DONE) done++;

      if (
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== TaskStatus.DONE
      ) {
        overdue++;
      }

      if (
        task.priority === TaskPriority.HIGH ||
        task.priority === TaskPriority.URGENT
      ) {
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
}
