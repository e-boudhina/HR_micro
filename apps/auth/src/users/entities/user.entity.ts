import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";


import { IsEmail } from "class-validator";
import { Role } from "../../roles/entities/role.entity";
//import { OrderMission } from "../../order-mission/entities/order-mission.entity";
@Entity({ name: 'users' })
//If you have 2 unique colums that must not be repeated use this one (use the @Colum annotation when you want field the be unique seprately but not Combined)
//@Unique(['email']) 
export class User {

    /* 
    Unique(['email'] & @Column({unique: true}) annotations are related to the database schema and how the entity is persisted in the database. 
    They don't perform data validation on incoming requests; for that purpose,
    you would use DTOs and validation decorators like @IsEmail,
    @IsNotEmpty, etc. in your controller or service.
     */

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    username: string;

    //@IsEmail()
    @Column()
    //managed in controller
    @Column({unique: true}) 
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    hashedRt?: string; // Use '?' to indicate optional property

    //what happend if nullable is not set what I I set it to false and ? symbol
    @Column({ nullable: true })
    passwordResetToken: string; 

    @Column({ nullable: true })
    resetPasswordExpirationToken: Date;

    @Column()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    /* 
    eager loading fetches the related data along with the main entity,
    while lazy loading defers the loading of related data until you explicitly access it
    */

    
    
    @ManyToOne(() => Role, role => role.users, { eager: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'role_id' }) 
    role_id: Role;
    //If it was not a forien key naming would be roleId but since it is we need to follow naming convetions

    /*
    @OneToMany(() => OrderMission, (orderMission) => orderMission.user_id)
    order_missions: OrderMission[];
    
    */
    //What does this means
    constructor(User: Partial<User>){
        Object.assign(this, User);
    }
    /*
    @BeforeInsert()
    setDefaultRole() {
        if (!this.role_id) {
            const defaultRole = new Role();
            defaultRole.name = RoleType.User;
            this.role_id = defaultRole;
        }
    }
    */
    
}
