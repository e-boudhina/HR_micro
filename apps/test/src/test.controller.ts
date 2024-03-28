import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @MessagePattern({ cmd: 'fetch_username' })
  async fetchUsername(@Ctx() context: RmqContext) {
    //if you do nt write channel ack the message will remain saved in the queue until you manually deelete them or disable acknewledgment
    const channel = context.getChannelRef();
    const message = context.getMessage();// get message from context
    channel.ack(message);
    console.log('QMQ test service reached')
    return 'Elyes BOudhina';
  }
}
