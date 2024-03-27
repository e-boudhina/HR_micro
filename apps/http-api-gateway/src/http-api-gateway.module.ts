import { Module } from '@nestjs/common';
import { HttpApiGatewayController } from './http-api-gateway.controller';
import { HttpApiGatewayService } from './http-api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from 'apps/auth/src/auth.controller';
import { RmqModule } from '@app/common';
import { AUTH_SERVICE } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: './.env'}),
    /*
    ClientsModule.register([
      {
        name:'AUTH_SERVICE',
        transport:Transport.TCP,
        options:{
            host:'127.0.0.1',
            port:4200
        }
      }
    ])
    */
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  controllers: [HttpApiGatewayController],
  providers: [
    
    HttpApiGatewayService,
    /*
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const USER = configService.get('RABBITMQ_USER');
        const PASSWORD = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
            queue: QUEUE,
            queueOptions:{
              durable: true // keep data between restarts
            },
          },
        });
      },
      inject:[ConfigService]
    },
    */
  ],
})
export class HttpApiGatewayModule {}
