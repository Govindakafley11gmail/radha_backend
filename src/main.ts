import 'dotenv/config'; // must be first so env vars are loaded before anything else
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const isProd = process.env.NODE_ENV === 'production';

  // Render sits behind a proxy. Needed for secure cookies and correct client IPs.
  app.set('trust proxy', 1);

  app.use(cookieParser());

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS: comma-separated list in CORS_ORIGIN, falls back to localhost for dev
  const allowedOrigins = [
  'http://localhost:3000',                // local dev (CRA / Next)
  'http://localhost:5173',                // local dev (Vite)
  'https://raddha-frontend.vercel.app',   // deployed frontend, no trailing slash
  ...(process.env.CORS_ORIGIN || '').split(','), // optional extras from Render env
]
  .map((o) => o.trim().replace(/\/+$/, '')) // strip trailing slashes
  .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // allow non-browser clients (curl, Postman, health checks) with no Origin header
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Reject quietly (no CORS headers) instead of throwing, which caused the 500
      Logger.warn(
        `Blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`,
        'CORS',
      );
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Graceful shutdown (Render sends SIGTERM on redeploy)
  app.enableShutdownHooks();

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');

  Logger.log(
    `Server running on port ${port} (${isProd ? 'production' : 'development'})`,
    'Bootstrap',
  );
}

bootstrap();