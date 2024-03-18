import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../../users/entities/user.entity";
import { Permission } from "../../permissions/entities/permission.entity";



@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @OneToMany(() => User, user => user.role_id)
    users: User[];
    
    @ManyToMany(() => Permission, permission => permission.roles)
    @JoinTable({ name: "role_permissions" })
    permissions: Permission[];

    constructor(Role: Partial<Role>){
        Object.assign(this, Role); 
    }
  
}
