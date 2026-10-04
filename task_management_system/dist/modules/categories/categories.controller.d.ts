import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(userId: string): Promise<import("./entities/category.entity.js").Category[]>;
    create(userId: string, createCategoryDto: CreateCategoryDto): Promise<import("./entities/category.entity.js").Category>;
    remove(id: string, userId: string): Promise<void>;
}
