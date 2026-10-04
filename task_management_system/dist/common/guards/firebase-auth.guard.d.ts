import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from '../../modules/auth/firebase.service.js';
import { UsersService } from '../../modules/users/users.service.js';
export declare class FirebaseAuthGuard implements CanActivate {
    private readonly reflector;
    private readonly firebaseService;
    private readonly usersService;
    constructor(reflector: Reflector, firebaseService: FirebaseService, usersService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
