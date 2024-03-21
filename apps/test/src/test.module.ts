import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [TestController],
  providers: [
    TestService,
    {
      provide: 'TEST_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 5200, // Assuming test microservice runs on port 4201
          },
        });
      },
    },],
})
export class TestModule {}
