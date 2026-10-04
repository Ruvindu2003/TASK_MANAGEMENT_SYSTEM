var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsEnum, IsString, IsIn } from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity.js';
export class TaskQueryDto {
    status;
    priority;
    categoryId;
    search;
    sortBy = 'createdAt';
    sortOrder = 'DESC';
}
__decorate([
    IsOptional(),
    IsEnum(TaskStatus),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsEnum(TaskPriority),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "priority", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "categoryId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "search", void 0);
__decorate([
    IsOptional(),
    IsIn(['createdAt', 'dueDate', 'priority', 'title', 'status']),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "sortBy", void 0);
__decorate([
    IsOptional(),
    IsIn(['ASC', 'DESC', 'asc', 'desc']),
    __metadata("design:type", String)
], TaskQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=task-query.dto.js.map