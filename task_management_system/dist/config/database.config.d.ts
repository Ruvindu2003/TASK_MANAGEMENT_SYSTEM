import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare const NEON_DB_URL = "postgresql://neondb_owner:npg_o2s0pXJquckS@ep-odd-mode-b4excefk-pooler.c-6.us-east-2.aws.neon.tech/task_management_system?sslmode=require";
export declare const getDatabaseConfig: (configService: ConfigService) => TypeOrmModuleOptions;
