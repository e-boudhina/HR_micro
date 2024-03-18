import { NestFactory } from '@nestjs/core';
import { HttpApiGatewayModule } from './http-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(HttpApiGatewayModule);
  await app.listen(3000);
}
bootstrap();
