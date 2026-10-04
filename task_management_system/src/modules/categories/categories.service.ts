import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(userId: string): Promise<Category[]> {
    return await this.categoriesRepository.find({
      where: { user_id: userId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto, userId: string): Promise<Category> {
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      user_id: userId,
    });
    return await this.categoriesRepository.save(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findOne(id, userId);
    await this.categoriesRepository.remove(category);
  }
}
