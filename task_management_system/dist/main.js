import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
const server = express();
let isAppInitialized = false;
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
async function bootstrap() {
    if (isAppInitialized)
        return;
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
    isAppInitialized = true;
}
const statusHandler = (req, res) => {
    res.json({
        status: 'ok',
        service: 'Task Management System API',
        message: 'Backend is running successfully on Vercel.',
        endpoints: {
            tasks: '/api/tasks',
            categories: '/api/categories',
            auth: '/api/auth',
            analytics: '/api/analytics',
        },
    });
};
server.get('/', statusHandler);
server.get('/api', statusHandler);
server.use(async (req, res, next) => {
    try {
        await bootstrap();
        next();
    }
    catch (err) {
        Logger.error('Serverless bootstrap error:', err);
        res.status(500).json({
            error: 'Backend Initialization Error',
            message: err?.message || 'Failed to initialize NestJS application',
            hint: 'Please check your Vercel Environment Variables (DATABASE_URL) in Vercel Project Settings.',
        });
    }
});
if (!process.env.VERCEL) {
    bootstrap().then(() => {
        const port = process.env.PORT || 5000;
        server.listen(port, () => {
            Logger.log(`Task Management API is running on: http://localhost:${port}/api`, 'Bootstrap');
        });
    });
}
export default server;
//# sourceMappingURL=main.js.map