import { Module } from '@nestjs/common';
import { EurekaServerController } from './eureka-server.controller';
import { EurekaServerService } from './eureka-server.service';
import { EurekaModule } from 'nestjs-eureka';

@Module({
  imports: [
    EurekaModule.forRoot({
      disable: false,
      disableDiscovery: false,
      eureka: {
        host: 'localhost', // Change this to your Eureka server's host
        port: 8761, // Change this to your Eureka server's port
        registryFetchInterval: 1000,
        servicePath: '/eureka/apps/',
        maxRetries: 3,
      },
      service: {
        name: 'auth-service', // Change this to your microservice's name
        port: 3200, // Change this to your microservice's port
      },
     
    }),
  ],
  controllers: [EurekaServerController],
  providers: [EurekaServerService],
})
export class EurekaServerModule {}
