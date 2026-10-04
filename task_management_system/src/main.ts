import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isAppInitialized = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable CORS for frontend
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter and response interceptor
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Root endpoint for status check
  server.get('/', (req, res) => {
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
  });

  await app.init();
  isAppInitialized = true;
  return app;
}

// Standalone execution for local development or non-Vercel environments
if (!process.env.VERCEL) {
  bootstrap().then((app) => {
    const port = process.env.PORT || 5000;
    app.listen(port);
    Logger.log(`Task Management API is running on: http://localhost:${port}/api`, 'Bootstrap');
  });
}

// Serverless handler for Vercel
export default async function handler(req: any, res: any) {
  try {
    if (!isAppInitialized) {
      await bootstrap();
    }
    server(req, res);
  } catch (err: any) {
    Logger.error('Serverless bootstrap error:', err);
    res.status(500).json({
      error: 'Backend Initialization Error',
      message: err?.message || 'Failed to initialize NestJS application',
      hint: 'Please check your Vercel Environment Variables (DATABASE_URL) in Vercel Project Settings.',
    });
  }
}
