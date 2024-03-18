import { NestFactory } from '@nestjs/core';
import { HttpApiGatewayModule } from './http-api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(HttpApiGatewayModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

}
bootstrap();
