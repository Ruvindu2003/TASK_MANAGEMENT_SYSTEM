import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isAppInitialized = false;
let bootstrapPromise: Promise<void> | null = null;

// Global top-level CORS middleware
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
  if (isAppInitialized) return;

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      try {
        const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
          logger: ['error', 'warn', 'log'],
        });

        // Enable CORS for frontend
        app.enableCors({
          origin: '*',
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
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

        await app.init();
        isAppInitialized = true;
      } catch (err) {
        bootstrapPromise = null;
        throw err;
      }
    })();
  }

  return bootstrapPromise;
}

// Root and /api endpoint for status check
const statusHandler = (req: any, res: any) => {
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

// Live diagnostic endpoint
const debugHandler = async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const result: any = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    },
  };

  // Test 1: Direct Neon PostgreSQL connection
  try {
    // @ts-ignore
    const { Client } = await import('pg');
    const client = new Client({
      connectionString: 'postgresql://neondb_owner:npg_o2s0pXJquckS@ep-odd-mode-b4excefk-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    await client.connect();
    const r = await client.query('SELECT NOW() as db_time, 1 as test');
    await client.end();
    result.neonPg = { status: 'ok', queryResult: r.rows[0] };
  } catch (err: any) {
    result.neonPg = { status: 'error', message: err?.message, stack: err?.stack };
  }

  // Test 2: jwks-rsa / jose import
  try {
    // @ts-ignore
    const jwks = await import('jwks-rsa');
    result.jwks = { status: 'ok', type: typeof jwks.default };
  } catch (err: any) {
    result.jwks = { status: 'error', message: err?.message, stack: err?.stack };
  }

  // Test 3: NestJS bootstrap
  try {
    await Promise.race([
      bootstrap(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Bootstrap timed out after 6000ms')), 6000),
      ),
    ]);
    result.bootstrap = { status: 'ok' };
  } catch (err: any) {
    result.bootstrap = { status: 'error', message: err?.message, stack: err?.stack };
  }

  return res.json(result);
};

server.get('/api/debug', debugHandler);

// Serverless handler for Vercel
export default async function handler(req: any, res: any) {
  // Fast CORS preflight handling - respond immediately
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Fast health check response for / and /api without waiting for cold start bootstrap
  const cleanUrl = (req.url || '').split('?')[0].replace(/\/+$/, '');
  if (cleanUrl === '' || cleanUrl === '/api') {
    return statusHandler(req, res);
  }

  if (cleanUrl === '/api/debug') {
    return debugHandler(req, res);
  }

  try {
    await bootstrap();
    return new Promise<void>((resolve, reject) => {
      res.on('finish', resolve);
      res.on('close', resolve);
      res.on('error', reject);
      server(req, res, (err: any) => {
        if (err) reject(err);
      });
    });
  } catch (err: any) {
    Logger.error('Serverless handler error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Backend Initialization Error',
        message: err?.message || 'Failed to initialize NestJS application',
        hint: 'Please check your Neon database connectivity and configuration.',
      });
    }
  }
}

// Standalone execution for local development
if (!process.env.VERCEL) {
  bootstrap().then(() => {
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      Logger.log(`Task Management API is running on: http://localhost:${port}/api`, 'Bootstrap');
    });
  });
}
