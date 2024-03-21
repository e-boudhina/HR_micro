import { NestFactory } from '@nestjs/core';
import { TestModule } from './test.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TestModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'test_queue', // Queue name
      queueOptions: {
        durable: false, // Set to true if you want the queue to survive broker restarts
      },
    },
  });
  
  await app.listen(); // Listen to the RMQ microservice
  
  console.log(`Test app is running`);
 
}
bootstrap();
