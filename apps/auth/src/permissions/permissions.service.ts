import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {

  constructor(
    @InjectRepository(Permission)
  private readonly permissionsRepository: Repository<Permission>){
  }

  async create(createPermissionDto: CreatePermissionDto) {
    const permissionNameToLC = createPermissionDto.name.toLocaleLowerCase();
    const existingRole = await this.permissionsRepository.findOneBy({ name: permissionNameToLC });

    if (existingRole) {
      // If the role already exists, you might want to throw an exception or handle it accordingly
      throw new ConflictException(`Role '${createPermissionDto.name}' already exists`);
    }

    // do I really need the create line - remove if unnecessary 
    const newPermission = this.permissionsRepository.create({name: permissionNameToLC});
    const result = await this.permissionsRepository.save(newPermission);
    if(result){
      return { 
        message : "Permission added!"
      }
    }
  }

  async findAll() {
    return await this.permissionsRepository.find();
  }

  async findOneById(id: number) {
    const permission = await this.permissionsRepository.findOneBy({id});

    if (!permission) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    return permission;
  }

  //can't you pass the entire object in update?? include the id in the dto?
  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    // Ensure the permission exists
    const existingRole = await this.findOneById(id);
 
    if (existingRole.name == updatePermissionDto.name) {
      // If the role already exists, you might want to throw an exception or handle it accordingly
      throw new ConflictException(`Role '${existingRole.name}' is already taken!`);
    }
    const result = await this.permissionsRepository.update(id, updatePermissionDto);
     
    if(result){
      return {
        message: `Permission with id ${id} updated`,
        data: await this.findOneById(id)
      };  
    }
  }

  async remove(id: number) {
    const permission = await this.findOneById(id); // Ensure the permission exists
    
    if(permission){
      //delte return the delted object without id
      const result = await this.permissionsRepository.remove(permission);
      if(result){
      return {
        message: `Permission with id ${id} removed`,
        data: result
      }; 
      //Do I need to handle the else here or in the controller or no need for that?
      //what about try and catch?
      }
    }

  }
}
