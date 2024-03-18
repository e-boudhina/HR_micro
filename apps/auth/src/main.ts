import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import "reflect-metadata";
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  /*
  const app = await NestFactory.createMicroservice(AuthModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  */
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
}
bootstrap();
