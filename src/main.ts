import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port : number = 3000;
  await app.listen(port);
  console.log(`Corriendo en el puerto ${3000}`);
}
bootstrap();
