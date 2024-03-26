import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceDiscoveryService {
  private registry: Map<string, string[]> = new Map();

  registerService(name: string, endpoints: string[]) {
    this.registry.set(name, endpoints);
  }

  discoverService(name: string) {
    return this.registry.get(name);
  }
}
