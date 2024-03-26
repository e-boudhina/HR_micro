import { NestFactory } from '@nestjs/core';
import { ServiceDiscoveryModule } from './service-discovery.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceDiscoveryModule);
  await app.listen(3000);
}
bootstrap();
