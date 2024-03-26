import { NestFactory } from '@nestjs/core';
import { HttpApiGatewayModule } from './http-api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RolesModule } from 'apps/auth/src/roles/roles.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { connect } from 'amqplib';

async function discoverServices(app: any) {
  const configService = app.get(ConfigService);
  const USER = configService.get('RABBITMQ_USER');
  const PASSWORD = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
  const connection = await connect(`amqp://${USER}:${PASSWORD}@${HOST}`);
  const channel = await connection.createChannel();

  const exchange = 'service-registry';
  const queue = 'api-gateway-queue';

  await channel.assertExchange(exchange, 'fanout', { durable: false });
  await channel.assertQueue(queue, { durable: false });
  await channel.bindQueue(queue, exchange, '');

  channel.consume(queue, (message) => {
    if (message !== null) {
      const serviceInfo = JSON.parse(message.content.toString());
      // Update routing table with service information
      console.log(`Discovered ${serviceInfo.name}: ${serviceInfo.endpoints}`);
      channel.ack(message);
    }
  });
}
async function bootstrap() {

  const app = await NestFactory.create(HttpApiGatewayModule);
  
  const configService = app.get(ConfigService); 
  app.useGlobalPipes(new ValidationPipe());
  await discoverServices(app);
 
  await app.listen(3200);
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
