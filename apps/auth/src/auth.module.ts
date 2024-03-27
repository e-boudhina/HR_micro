import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './common/strategies';

import { MailModule } from './mail/mail.module';
import { Role } from './roles/entities/role.entity';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule, RmqModule } from '@app/common';
import { RolesService } from './roles/roles.service';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { TEST_SERVICE } from './common/constants/services';
//import { RmqModule } from '@app/common/rmq/rmq.module';



@Module({
  imports: [ 
    JwtModule.register({secret: 'at-secret'}),
    TypeOrmModule.forFeature([User, Role]),
    MailModule,
    ConfigModule.forRoot({isGlobal: true, envFilePath: './apps/auth/.env'}), // make this or add it to common since its cglobal liek database!!
    DatabaseModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    JwtModule.register({}),
    RmqModule.register({
      name: TEST_SERVICE,
    }),

   
  ], 
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    /*
    {
      provide: 'TEST_SERVICE',
      useFactory: (configService: ConfigService) => {
        const USER = configService.get('RABBITMQ_USER');
        const PASSWORD = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
        
        // Create client proxy dynamically
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
            queue: QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
      
    },
    */
  ],
  controllers: [AuthController],
 
})
export class AuthModule {}
