import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class HttpApiGatewayService {
  private client: ClientProxy;


  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'], // RabbitMQ connection URL
        queue: 'service-discovery', // RabbitMQ queue name for service discovery
      },
    });
  }

  async onModuleInit() {
    await this.discoverServices();
  }

  async discoverServices() {
    // Subscribe to service discovery events
    this.client.subscribe('discoverService').subscribe((serviceInfo: any) => {
      console.log(`Discovered service: ${serviceInfo.name}, Endpoints: ${serviceInfo.endpoints}`);
      // Store or use service information as needed
    });
  }
}

