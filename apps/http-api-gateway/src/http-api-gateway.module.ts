import { Module } from '@nestjs/common';
import { HttpApiGatewayController } from './http-api-gateway.controller';
import { HttpApiGatewayService } from './http-api-gateway.service';

@Module({
  imports: [],
  controllers: [HttpApiGatewayController],
  providers: [HttpApiGatewayService],
})
export class HttpApiGatewayModule {}
