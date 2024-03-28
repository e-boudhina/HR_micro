import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public } from '../common/decorators/public.decorator';
import { MessagePattern } from '@nestjs/microservices';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Public()
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Public()
  @Get()
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rolesService.getRoleById(id);
  }
  
  @Public()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.rolesService.deleteRole(id);
  }
  
  @Public()
  @Post('assign-role-to-user')
  assignRoleToUser(@Body() requestBody: { userId: number, roleId: number} ) {
    console.log(requestBody);
    const { userId, roleId } = requestBody;
    return this.rolesService.assignRoleToUser(userId, roleId);
  }
        
      
  //Figure our the right way to pull info from the request
  //do you need to create types
  @Public()
  @Post('assign-permission-to-role')
  assignPermissionsToRole(@Body() requestBody: { roleId: number, permissionIds: number[]} ) {
    console.log(requestBody);
    const { roleId, permissionIds } = requestBody;
    return this.rolesService.assignPermissionToRole(roleId, permissionIds);
  }

  
}
/*
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}


  @MessagePattern({ cmd: 'create_role' })
  create(createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @MessagePattern({ cmd: 'get_all_roles' })
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @MessagePattern({ cmd: 'get_role_by_id' })
  findOne(id: number) {
    return this.rolesService.getRoleById(id);
  }
  
  @MessagePattern({ cmd: 'update_role' })
  update(payload: { id: number, updateRoleDto: UpdateRoleDto }) {
    const { id, updateRoleDto } = payload;
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @MessagePattern({ cmd: 'delete_role' })
  remove(id: number) {
    return this.rolesService.deleteRole(id);
  }

  @MessagePattern({ cmd: 'assign_role_to_user' })
  assignRoleToUser(payload: { userId: number, roleId: number }) {
    const { userId, roleId } = payload;
    return this.rolesService.assignRoleToUser(userId, roleId);
  }

  @MessagePattern({ cmd: 'assign_permissions_to_role' })
  assignPermissionsToRole(payload: { roleId: number, permissionIds: number[] }) {
    const { roleId, permissionIds } = payload;
    return this.rolesService.assignPermissionToRole(roleId, permissionIds);
  }

}  */