import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import "reflect-metadata";


async function bootstrap() {
  /*
  const app = await NestFactory.createMicroservice(AuthModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  */

  
 //await app.listen(4200);
//  console.log(`Auth app is running on port ${await app.getUrl()}`);

/*
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
  */
 
  /*
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const USER = configService.get('RABBITMQ_USER');
  const PASSWORD = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
console.log(`amqp://${USER}:${PASSWORD}@${HOST}`);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck: false,
      queue: QUEUE,
      queueOptions:{
        durable: true, // keep data between restarts
      },
    }
  });
  await app.startAllMicroservices();
*/
  
const app = await NestFactory.create(AuthModule);
app.useGlobalPipes(new ValidationPipe());
await app.startAllMicroservices();

await app.listen(3500);
  // Constructing the log message with a star and formatting

  const message = `Server is listening on: ${await app.getUrl()}`;

  const stars = ' *'.repeat(message.length); // Adding 4 for padding

  // Logging the message with stars for emphasis using the Nest.js logger
  Logger.log(stars);
  Logger.log(`* ${message} *`,  'Auth-application');
  Logger.log(stars);

}
bootstrap();
