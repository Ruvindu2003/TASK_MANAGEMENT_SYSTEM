import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from '../../modules/auth/firebase.service.js';
import { UsersService } from '../../modules/users/users.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (isPublic) {
        return true;
      }
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = await this.firebaseService.verifyIdToken(token);
      const user = await this.usersService.findOrCreateByFirebase(decoded);
      request.user = user;
      return true;
    } catch (error: any) {
      if (isPublic) {
        return true;
      }
      throw new UnauthorizedException(
        error.message || 'Unauthorized: Invalid Firebase token',
      );
    }
  }
}
