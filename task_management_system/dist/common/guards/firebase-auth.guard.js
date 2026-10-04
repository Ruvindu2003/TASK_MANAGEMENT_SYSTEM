var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from '../../modules/auth/firebase.service.js';
import { UsersService } from '../../modules/users/users.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
let FirebaseAuthGuard = class FirebaseAuthGuard {
    reflector;
    firebaseService;
    usersService;
    constructor(reflector, firebaseService, usersService) {
        this.reflector = reflector;
        this.firebaseService = firebaseService;
        this.usersService = usersService;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
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
        }
        catch (error) {
            if (isPublic) {
                return true;
            }
            throw new UnauthorizedException(error.message || 'Unauthorized: Invalid Firebase token');
        }
    }
};
FirebaseAuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector,
        FirebaseService,
        UsersService])
], FirebaseAuthGuard);
export { FirebaseAuthGuard };
//# sourceMappingURL=firebase-auth.guard.js.map