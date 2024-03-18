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
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [ 
    JwtModule.register({secret: 'at-secret'}),
    TypeOrmModule.forFeature([User, Role]),
    MailModule,
    ConfigModule.forRoot({isGlobal: true}), // make this or add it to common since its cglobal liek database!!
    DatabaseModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    JwtModule.register({}),
  ], 
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
