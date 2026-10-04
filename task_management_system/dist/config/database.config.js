import { User } from '../modules/users/entities/user.entity.js';
import { Task } from '../modules/tasks/entities/task.entity.js';
import { Category } from '../modules/categories/entities/category.entity.js';
const NEON_DB_URL = 'postgresql://neondb_owner:npg_o2s0pXJquckS@ep-odd-mode-b4excefk-pooler.c-6.us-east-2.aws.neon.tech/task_management_system?sslmode=require';
export const getDatabaseConfig = (configService) => {
    const databaseUrl = configService.get('DATABASE_URL') ||
        process.env.DATABASE_URL ||
        NEON_DB_URL;
    const isProduction = configService.get('NODE_ENV') === 'production' || !!databaseUrl;
    const baseConfig = {
        type: 'postgres',
        entities: [User, Task, Category],
        synchronize: false,
        logging: false,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        extra: isProduction
            ? {
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 5000,
                max: 1,
                idleTimeoutMillis: 2000,
            }
            : undefined,
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