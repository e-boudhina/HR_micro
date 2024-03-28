import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqModule } from '@app/common';

@Module({
  imports: [  RmqModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
