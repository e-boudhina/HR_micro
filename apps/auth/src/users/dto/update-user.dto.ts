import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumber, IsOptional, Matches, MaxLength, MinLength } from 'class-validator';


export class UpdateUserDto extends PartialType(CreateUserDto) {

    @MinLength(10, { message: 'Username should be at least 10 characters long'})
    @MaxLength(40, { message: 'Username should not exceed 40 characters'})
    @IsNotEmpty({ message: 'Username must be provided'})
    username: string;

    @MinLength(10, { message: 'Email should be at least 10 characters long'})
    @MaxLength(40, { message: 'Email should not exceed 40 characters'})
    @IsNotEmpty({ message: 'Email must be provided'})
    @Matches(CreateUserDto.customEmailRegex, { message: 'Invalid email format' })
    email: string;
    /*
    @MinLength(10, { message: 'Password should be at least 10 characters long'})
    @MaxLength(40, { message: 'Password should not exceed 40 characters'})
    @IsNotEmpty({ message: 'Password must be provided'})
    password: string;
    */
    //@IsNumber()
    //@IsNotEmpty({ message: 'Role must be provided'})
    @IsOptional()
    @IsNumber()
    role_id?: number;
}
