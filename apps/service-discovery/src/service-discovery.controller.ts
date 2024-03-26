import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ServiceDiscoveryService } from './service-discovery.service';

@Controller('service-discovery')
export class ServiceDiscoveryController {
  constructor(private readonly serviceDiscoveryService: ServiceDiscoveryService) {}

  @Post('register')
  registerService(@Body() body: { name: string; endpoints: string[] }) {
    const { name, endpoints } = body;
    this.serviceDiscoveryService.registerService(name, endpoints);
  }

  @Get(':name')
  discoverService(@Param('name') name: string) {
    return this.serviceDiscoveryService.discoverService(name);
  }
}