import { Controller, Get, Inject, Post } from '@nestjs/common';
import { HttpApiGatewayService } from './http-api-gateway.service';
import { AuthService } from 'apps/auth/src/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AUTH_SERVICE } from './constants/services';

@Controller()
export class HttpApiGatewayController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy
    ) {}

    @Get()
    async getUser(){
      console.log('get user endpoint reached');
      
      return  await lastValueFrom(this.authService.send({ cmd: 'fetch_user' }, {}));

    }
    @Post()
    async getMessage(){
      return "hey"
    }
}
