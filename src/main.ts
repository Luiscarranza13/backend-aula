import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // CORS - Permitir frontend en desarrollo y producción
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      // Agregar tu dominio de Netlify aquí
      /\.netlify\.app$/,
      /\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Puerto - Railway provee PORT automáticamente
  const port = process.env.PORT || 3001;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Servidor NestJS corriendo en puerto ${port}`);
  console.log(`📦 Entorno: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
