
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { join } from 'path';
//import { User } from '../../../users/entities/user.entity';

@Module({
    imports: [
      TypeOrmModule.forRootAsync({
         useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.getOrThrow('MYSQL_HOST'),
          username: configService.getOrThrow('MYSQL_USERNAME'),
          //password: configService.getOrThrow('MYSQL_PASSWORD'),
          password: configService.getOrThrow('MYSQL_ROOT_PASSWORD'),
          port: configService.getOrThrow('MYSQL_PORT'),
          database: configService.getOrThrow('MYSQL_DATABASE'),
          autoLoadEntities: true,
          //Automaticly synchronize databases colums, if you change something here it automaticly updates the db
          synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
          migrationsRun: true,
          //entities: [User],
          //migrations: ['/src/migration/**'],
         
          //dropSchema: configService.getOrThrow('MYSQL_dropSchema'),
          //entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      
        }),
        inject: [ConfigService],
      }),
    ],
  })
  export class DatabaseModule {} 
  