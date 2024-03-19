import { Controller, Get, Inject, Post } from '@nestjs/common';
import { HttpApiGatewayService } from './http-api-gateway.service';
import { AuthService } from 'apps/auth/src/auth.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class HttpApiGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy
    ) {}

    @Get('/')
    async getUser(){
      console.log('end poitn reahced');
      return this.authService.send(
        {
          cmd: 'get-user'
        },
        {}
        );
    }
}
