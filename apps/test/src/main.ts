import { NestFactory } from '@nestjs/core';
import { TestModule } from './test.module';
import { RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';


async function bootstrap() {
 

  /*
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
  */
 /*
  const app = await NestFactory.create(TestModule);
  const configService = app.get(ConfigService);
  const USER = configService.get('RABBITMQ_USER');
  const PASSWORD = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
console.log(`amqp://${USER}:${PASSWORD}@${HOST}`);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck: false,
      queue: QUEUE,
      queueOptions:{
        durable: true, // keep data between restarts
      },
    }
  });
  */
  const app = await NestFactory.create(TestModule);
  const rmqService = app.get<RmqService>(RmqService); //  I don't get the syntax
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('TEST'));
  await app.startAllMicroservices();
 
}
bootstrap();
