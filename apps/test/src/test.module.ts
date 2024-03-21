import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }),],
  controllers: [TestController],
  providers: [
    TestService,
    {
      provide: 'TEST_SERVICE',
      useFactory: (configService: ConfigService) => {
        // Get RabbitMQ configuration from environment variables or configuration file
        const RABBITMQ_USER = configService.get('RABBITMQ_USER');
        const RABBITMQ_PASS = configService.get('RABBITMQ_PASS');
        const RABBITMQ_HOST = configService.get('RABBITMQ_HOST');
        const RABBITMQ_QUEUE = configService.get('RABBITMQ_QUEUE');
        console.log(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`);
        // Create client proxy dynamically
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`],
            queue: RABBITMQ_QUEUE,
            queueOptions: {
              durable: true, // Keep data between restarts
            },
          },
        });
      },
      inject: [ConfigService], // Inject ConfigService
    },
  ],
})
export class TestModule {}
