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
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { RolesService } from './roles/roles.service';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
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
    //RmqModule
    ClientsModule.register([
      {
        name:'TEST_SERVICE',
        transport:Transport.TCP,
        options:{
            host:'127.0.0.1',
            port:5200
        }
      }
    ])
  ], 
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    
  ],
  controllers: [AuthController],
 
})
export class AuthModule {}
