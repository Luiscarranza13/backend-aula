import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Iniciando Aula Virtual Backend...');
    console.log(`📦 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Base de datos: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    
    // Asegurar que JWT_SECRET exista
    if (!process.env.JWT_SECRET) {
      console.log('⚠️  JWT_SECRET no definido, usando valor por defecto');
      process.env.JWT_SECRET = 'aula-virtual-secret-key-2024-default';
    }

    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      logger: ['error', 'warn', 'log'],
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
        'https://aulavirtual-luis.netlify.app',
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

    console.log(`✅ Servidor corriendo en puerto ${port}`);
    console.log(`🌐 URL: http://0.0.0.0:${port}`);
    console.log(`📡 Health check: http://0.0.0.0:${port}/`);
  } catch (error) {
    console.error('❌ Error fatal al iniciar el servidor:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Error no capturado en bootstrap:', error);
  process.exit(1);
});
