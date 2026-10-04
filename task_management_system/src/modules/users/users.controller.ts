import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { User } from './entities/user.entity.js';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard.js';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { displayName?: string; photoUrl?: string },
  ) {
    return this.usersService.updateProfile(userId, body);
  }
}
