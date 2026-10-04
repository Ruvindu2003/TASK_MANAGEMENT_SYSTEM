import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity.js';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsController } from './analytics.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
