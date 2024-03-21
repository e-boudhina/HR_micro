import { NestFactory } from '@nestjs/core';
import { HttpApiGatewayModule } from './http-api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RolesModule } from 'apps/auth/src/roles/roles.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const app = await NestFactory.create(HttpApiGatewayModule);
  
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

 
  await app.listen(3200);
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
