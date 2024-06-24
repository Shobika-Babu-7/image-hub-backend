import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// @ts-ignore
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger:  ['log', 'debug', 'verbose', 'error', 'warn']});
  app.enableCors({
    // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    origin: ['http://localhost:3001'],
    credentials: true,
  });
  app.use(graphqlUploadExpress({maxFileSize: 1000000, maxFiles: 10 }));
  await app.listen(3000);
}
bootstrap();
