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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findOrCreateByFirebase(decoded) {
        let user = await this.usersRepository.findOne({
            where: { firebaseUid: decoded.uid },
        });
        if (!user) {
            user = new User();
            user.firebaseUid = decoded.uid;
            user.email = decoded.email;
            user.displayName = decoded.name || '';
            user.photoUrl = decoded.picture || '';
            return await this.usersRepository.save(user);
        }
        let shouldUpdate = false;
        if (decoded.name && user.displayName !== decoded.name) {
            user.displayName = decoded.name;
            shouldUpdate = true;
        }
        if (decoded.picture && user.photoUrl !== decoded.picture) {
            user.photoUrl = decoded.picture;
            shouldUpdate = true;
        }
        if (shouldUpdate) {
            return await this.usersRepository.save(user);
        }
        return user;
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByFirebaseUid(firebaseUid) {
        return await this.usersRepository.findOne({ where: { firebaseUid } });
    }
    async updateProfile(id, data) {
        const user = await this.findById(id);
        if (data.displayName !== undefined)
            user.displayName = data.displayName;
        if (data.photoUrl !== undefined)
            user.photoUrl = data.photoUrl;
        return await this.usersRepository.save(user);
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __metadata("design:paramtypes", [Repository])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map