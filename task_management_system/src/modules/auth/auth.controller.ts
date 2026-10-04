import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard.js';
import { User } from '../users/entities/user.entity.js';

@Controller('auth')
export class AuthController {
  @Post('sync')
  @UseGuards(FirebaseAuthGuard)
  async syncUser(@CurrentUser() user: User) {
    return {
      message: 'User authenticated and synchronized successfully',
      user,
    };
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Public()
  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'auth' };
  }
}
