import { Module } from '@nestjs/common';
import { ServiceDiscoveryController } from './service-discovery.controller';
import { ServiceDiscoveryService } from './service-discovery.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule to use the ConfigService
    ClientsModule.registerAsync([
      {
        name: 'SERVICE_DISCOVERY',
        useFactory: (configService: ConfigService) => {
          const USER = configService.get('RABBITMQ_USER');
          const PASSWORD = configService.get('RABBITMQ_PASS');
          const HOST = configService.get('RABBITMQ_HOST');
          const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue: QUEUE,
              queueOptions: {
                durable: true,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ServiceDiscoveryController],
  providers: [ServiceDiscoveryService],
})
export class ServiceDiscoveryModule {}
