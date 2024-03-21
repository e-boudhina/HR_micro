import { NestFactory } from '@nestjs/core';
import { TestModule } from './test.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TestModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options:{
      host: '127.0.0.1',
      port: 5200
    }
  })
  
  await app.startAllMicroservices();
  await app.listen(5200);
  console.log(`Test app is running on port ${await app.getUrl()}`);
}
bootstrap();
