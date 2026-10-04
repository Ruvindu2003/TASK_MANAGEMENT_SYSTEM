import { User } from '../modules/users/entities/user.entity.js';
import { Task } from '../modules/tasks/entities/task.entity.js';
import { Category } from '../modules/categories/entities/category.entity.js';
export const getDatabaseConfig = (configService) => {
    const databaseUrl = configService.get('DATABASE_URL');
    const isProduction = configService.get('NODE_ENV') === 'production' || !!databaseUrl;
    const baseConfig = {
        type: 'postgres',
        entities: [User, Task, Category],
        synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: isProduction ? { rejectUnauthorized: false } : false,
    };
    if (databaseUrl) {
        return {
            ...baseConfig,
            url: databaseUrl,
        };
    }
    return {
        ...baseConfig,
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', '123'),
        database: configService.get('DB_NAME', 'task_management_system'),
    };
};
//# sourceMappingURL=database.config.js.map