import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard.js';

@Controller('analytics')
@UseGuards(FirebaseAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(@CurrentUser('id') userId: string) {
    return this.analyticsService.getSummary(userId);
  }
}
