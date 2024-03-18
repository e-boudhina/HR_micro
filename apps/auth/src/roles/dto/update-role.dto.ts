import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {

    //@IsNotEmpty({ message: 'Role id must be provided'})
    //id: number;

    @MinLength(3, { message: 'Role should be at least 3 characters long'})
    @MaxLength(30, { message: 'Role should not exceed 30 characters'})
    @IsNotEmpty({ message: 'Role must be provided'})
    name: string;
}
