import { NestFactory } from '@nestjs/core';
import { HttpApiGatewayModule } from './http-api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RolesModule } from 'apps/auth/src/roles/roles.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {


  const app = await NestFactory.create(HttpApiGatewayModule);
  
 // const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
// Configure reverse proxy
const routeMappings = [
  { path: '/auth', target: 'http://localhost:3500' }, // AuthController
  { path: '/permissions', target: 'http://localhost:3500' }, // PermissionsController
  { path: '/users', target: 'http://localhost:3500' }, // UsersController
  { path: '/roles', target: 'http://localhost:3500' }, // RolesController
  // Add more route mappings as needed
];

// Iterate over the route mappings and configure reverse proxy for each controller
routeMappings.forEach(mapping => {
  app.use(mapping.path, createProxyMiddleware({ 
    target: mapping.target, // Target URL of the corresponding service
    changeOrigin: true // Change the origin of the host header to the target URL
  }));
});
 
 
  await app.listen(3200);

  const message = `Server is listening on: ${await app.getUrl()}`;

  const stars = ' *'.repeat(message.length); // Adding 4 for padding

  // Logging the message with stars for emphasis using the Nest.js logger
  Logger.log(stars);
  Logger.log(`* ${message} *`,  'Http-api-gateway-application');
  Logger.log(stars);
}
bootstrap();

