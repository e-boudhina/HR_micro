import { Controller, Get } from '@nestjs/common';
import { EurekaServerService } from './eureka-server.service';

@Controller()
export class EurekaServerController {
  constructor(private readonly eurekaServerService: EurekaServerService) {}

  @Get()
  getHello(): string {
    return this.eurekaServerService.getHello();
  }
}
