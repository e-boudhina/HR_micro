import { Injectable } from '@nestjs/common';

@Injectable()
export class EurekaServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
