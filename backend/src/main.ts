import { NestFactory } from '@nestjs/core';
import { HttpException, HttpStatus, ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('GlobalExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'object' ? (exceptionResponse as any).message || exception.message : exception.message;
      error = exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = { name: exception.name, message: exception.message, stack: exception.stack };
    }

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(process.env.NODE_ENV === 'development' && { error, stack: exception instanceof Error ? exception.stack : undefined }),
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  // Enable CORS for frontend integration
  // Allow CORS_ORIGIN to be either a JSON array string, a comma-separated string, or omitted.
  const rawCors = process.env.CORS_ORIGIN;
  let origins: string | string[] = ['http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3001'];

  if (rawCors) {
    try {
      // Try parsing as JSON first (supports arrays in env)
      const parsed = JSON.parse(rawCors);
      if (Array.isArray(parsed)) origins = parsed;
      else if (typeof parsed === 'string') origins = parsed.split(',').map((s) => s.trim()).filter(Boolean);
    } catch {
      // Fallback: treat as comma separated list
      origins = rawCors.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  const corsOptions = {
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  };
  app.enableCors(corsOptions as any);
  logger.log(`CORS enabled for origins: ${Array.isArray(origins) ? origins.join(', ') : origins}`);
  
  // Apply global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  const port = process.env.PORT ?? 3000;
  
  await app.listen(port);
  
  logger.log(`🚀 Server is running on http://localhost:${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV}`);

  // Verify DATABASE_URL is configured and log a sanitized version
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    logger.error('DATABASE_URL is not configured. Please set it in your .env file (see .env.example)');
  } else {
    // attempt to sanitize credentials when logging
    try {
      const urlObj = new URL(dbUrl.replace(/^postgresql:\/\//, 'http://'));
      const hostPort = `${urlObj.hostname}${urlObj.port ? `:${urlObj.port}` : ''}`;
      logger.log(`Database host: ${hostPort}`);
    } catch {
      // Fallback to partial reveal
      logger.log(`Database: ${dbUrl.includes('@') ? dbUrl.split('@')[1] : 'Configured'}`);
    }
  }
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
