import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { JwtModule } from '@nestjs/jwt';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Permission } from '../permissions/entities/permission.entity';


@Module({
  imports: [ JwtModule.register({}), TypeOrmModule.forFeature([Role, User, Permission])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService] 
})
export class RolesModule {}
