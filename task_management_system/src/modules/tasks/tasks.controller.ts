import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskQueryDto } from './dto/task-query.dto.js';
import { TaskStatus } from './entities/task.entity.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard.js';

@Controller('tasks')
@UseGuards(FirebaseAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('status') status: TaskStatus,
  ) {
    return this.tasksService.updateStatus(id, status, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
