import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from './firebase.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard.js';

@Global()
@Module({
  imports: [ConfigModule, UsersModule],
  providers: [FirebaseService, FirebaseAuthGuard],
  controllers: [AuthController],
  exports: [FirebaseService, FirebaseAuthGuard],
})
export class AuthModule {}
