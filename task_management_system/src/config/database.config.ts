import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity.js';
import { Task } from '../modules/tasks/entities/task.entity.js';
import { Category } from '../modules/categories/entities/category.entity.js';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', '123'),
  database: configService.get<string>('DB_NAME', 'task_management_system'),
  entities: [User, Task, Category],
  synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
  logging: configService.get<string>('NODE_ENV') === 'development',
});
