import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import "reflect-metadata";
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RolesModule } from './roles/roles.module';
import { connect } from 'amqplib';
import { Logger } from '@nestjs/common';

async function registerService() {
  const connection = await connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchange = 'service-registry';
  const serviceName = 'auth-service';

  await channel.assertExchange(exchange, 'fanout', { durable: false });

  const serviceInfo = {
    name: serviceName,
    endpoints: ['/auth'], // Example endpoints
    // Add other metadata as needed
  };

  channel.publish(exchange, '', Buffer.from(JSON.stringify(serviceInfo)));

  console.log(`Registered ${serviceName} with RabbitMQ`);
}


async function bootstrap() {
  /*
  const app = await NestFactory.createMicroservice(AuthModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  */

  
 //await app.listen(4200);
//  console.log(`Auth app is running on port ${await app.getUrl()}`);

/*
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
  */
 
  
  const app = await NestFactory.create(AuthModule);
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
  await app.startAllMicroservices().then(() => Logger.log('✨ Auth MicroService Started'));;


 

}
bootstrap();
