import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard.js';

@Controller('categories')
@UseGuards(FirebaseAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.categoriesService.findAll(userId);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(createCategoryDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.categoriesService.remove(id, userId);
  }
}
