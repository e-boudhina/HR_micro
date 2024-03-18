import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public } from '../common/decorators/public.decorator';

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