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
import { Category } from './entities/category.entity.js';
let CategoriesService = class CategoriesService {
    categoriesRepository;
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    async findAll(userId) {
        return await this.categoriesRepository.find({
            where: { user_id: userId },
            order: { createdAt: 'ASC' },
        });
    }
    async findOne(id, userId) {
        const category = await this.categoriesRepository.findOne({
            where: { id, user_id: userId },
        });
        if (!category) {
            throw new NotFoundException(`Category not found`);
        }
        return category;
    }
    async create(createCategoryDto, userId) {
        const category = this.categoriesRepository.create({
            ...createCategoryDto,
            user_id: userId,
        });
        return await this.categoriesRepository.save(category);
    }
    async remove(id, userId) {
        const category = await this.findOne(id, userId);
        await this.categoriesRepository.remove(category);
    }
};
CategoriesService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Category)),
    __metadata("design:paramtypes", [Repository])
], CategoriesService);
export { CategoriesService };
//# sourceMappingURL=categories.service.js.map