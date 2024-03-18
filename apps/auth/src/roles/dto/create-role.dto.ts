import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateRoleDto {
    @MinLength(3, { message: 'Role should be at least 3 characters long'})
    @MaxLength(30, { message: 'Role should not exceed 30 characters'})
    @IsNotEmpty({ message: 'Role must be provided'})
    name: string;
}
