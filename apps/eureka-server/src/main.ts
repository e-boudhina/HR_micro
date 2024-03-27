import { NestFactory } from '@nestjs/core';
import { EurekaServerModule } from './eureka-server.module';

async function bootstrap() {
  const app = await NestFactory.create(EurekaServerModule);
  await app.listen(8761); // Port 8761 is commonly used for Eureka servers
}
bootstrap();
