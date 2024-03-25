import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @MessagePattern({ cmd: 'fetch_username' })
  async fetchUsername() {
    console.log('QMQ test service reached')
    return 'Elyes BOudhina';
  }
}
