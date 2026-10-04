var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard.js';
import { User } from '../users/entities/user.entity.js';
let AuthController = class AuthController {
    async syncUser(user) {
        return {
            message: 'User authenticated and synchronized successfully',
            user,
        };
    }
    async getCurrentUser(user) {
        return user;
    }
    healthCheck() {
        return { status: 'ok', service: 'auth' };
    }
};
__decorate([
    Post('sync'),
    UseGuards(FirebaseAuthGuard),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "syncUser", null);
__decorate([
    Get('me'),
    UseGuards(FirebaseAuthGuard),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    Public(),
    Get('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "healthCheck", null);
AuthController = __decorate([
    Controller('auth')
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map