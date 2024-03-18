import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { UpdatePermissionDto } from '../permissions/dto/update-permission.dto';
import { CreatePermissionDto } from '../permissions/dto/create-permission.dto';

@Injectable()
export class RolesService {
  constructor( 
  @InjectRepository(Role)
  private readonly rolesRepository: Repository<Role>,
  @InjectRepository(User)
  private readonly usersRepository: Repository<User>,
  @InjectRepository(Permission)
  private readonly permissionsRepository: Repository<Permission>
  ){}

  async create(createPermissionDto: CreatePermissionDto) {
    //const role = await this.rolesRepository.save({
    //  name: createRoleDto.name});  
      
      //lowercase and uppercase does not matter but check for convinience
      //make sure it is unique and does not exist ( see which one is better) in entity or in controller
      //return message if one ( if you add roels the enum in cod won't change but it will on the app)
      const existingRole = await this.rolesRepository.findOneBy({ name:createPermissionDto.name });

    if (existingRole) {
      // If the role already exists, you might want to throw an exception or handle it accordingly
      throw new ConflictException(`Role '${createPermissionDto.name}' already exists`);
    }

    const newRole = this.rolesRepository.create({ name:createPermissionDto.name });
    const result = await this.rolesRepository.save(newRole);
    if(result){
      return {  
        message: "Role added successfully!",
        data: result
      }
    }
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async getRoleById(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOneBy({
     id
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found!`);
    }
    return role;
  }

  
  async updateRole(id: number, updatePermissionDto: UpdatePermissionDto) {
    const existingRole = await this.rolesRepository.findOneBy({ name: updatePermissionDto.name });

    if (existingRole) {
      // If the role already exists, you might want to throw an exception or handle it accordingly
      throw new ConflictException(`Role '${updatePermissionDto.name}' is already taken!`);
    }
    const role = await this.getRoleById(id);
    role.name = updatePermissionDto.name;
    //Is it better to to simply add id to dto then use save which make it one argument or using update and passing 2 arguments?
    const result = await this.rolesRepository.update(id, role);
    if(result){
      return {
        message: `The Role under the id ${id} has been updated successfully!`,
        data: await this.getRoleById(id)
      };  
    }
  }

  async deleteRole(id: number) {
    const role = await this.getRoleById(id);
    if(role){
      //delete return the delted object without id
      //which is better to pass the object or the id? ( id faster)
      const result = await this.rolesRepository.remove(role);
      if(result){
      return {
        message: `Role with id ${id} removed succssfully!`,
        data: result
      }; 
      //Do I need to handle the else here or in the controller or no need for that? => No, it is handled by the findby Id :)
      //what about try and catch?
      }
    }
  }

  async assignRoleToUser(userId: number, roleId: number){
    const user = await this.usersRepository.findOneBy({ id: userId });
    //console.log("incoming role:"+roleId +" and user has role "+user.role_id.id)
    if (user.role_id.id === roleId) {
      // If the role already exists, you might want to throw an exception or handle it accordingly
    throw new ConflictException(`User has been given this role already!`);
    }
    user.role_id.id = roleId;
    const result = await this.usersRepository.save(user);
    if(result){
      return {
        message: `User '${user.email}' has been assigned role id '${userId}' successfully`,
      };  
    }
  }

  async assignPermissionToRole(roleId: number, permissionIds: number[]) {
    const role = await this.rolesRepository.findOne({
      where: {
        id: roleId,
      },
      relations: {
        permissions: true,
      },
    });
    if (!role) {
      throw new ConflictException('Role not found'); 
    }
    
    //grab all permissions
    const permissionIdsDB = await this.permissionsRepository.find({select: ['id']});
    //const permissionIdsDBMapped = permissionIdsDB.map(permission => permission.id);
    //console.log(permissionIds);
    //console.log(permissionIdsDBMapped);
    
    //alternative way
    /*
    const noneMatchPermission = permissionIds.every(permissionId => !permissionIdsDBMapped.includes(permissionId));
    console.log(noneMatchPermission);
    if (noneMatchPermission) {
      console.log("None of the elements in permissionIds match any element in permissionIdsDBMapped.");
    } else {
      console.log("There is at least one match between permissionIds and permissionIdsDBMapped.");
    }*/
    //check if the permission exist in permission db
    //const permissionsNotExisting = permissionIdsDB.filter(permission => !permissionIds.includes(permission.id));
    const permissionsNotPresent = permissionIds.filter(permissionId =>
      !permissionIdsDB.some(permission => permission.id === permissionId)
      );
    
    if (permissionsNotPresent.length > 0) {
      throw new ConflictException('Permissions do not exist! You must create them first');
    }
    //throw new ConflictException('end point'); 

    //format Permission [{ id: 7, name: 'delete user accounts' },Permission { id: 8, name: 'add user accounts' }]
    //console.log(role.permissions);
   
    //checking if permission is already assigned
    const existingPermissions = role.permissions.filter(permission => permissionIds.includes(permission.id));
    if (existingPermissions.length > 0) {
      console.log("These permissions are already assinged to this role: ", existingPermissions);
      throw new ConflictException('These permissions are already assinged to this role!');
    }

    await Promise.all(
      permissionIds.map(async (id) => {
        const p = await this.permissionsRepository.findOneBy({ id });
        role.permissions.push(p); 
      })
    );
    
    const result = await this.rolesRepository.save(role);
    if(result){
      return {
        message: `Permission '${permissionIds}' have been added to role '${role.name}' successfully`,
      };  
    }
  } 
  
}
 