import { ForbiddenException, HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './users/dto/create-user.dto';
import { User } from './users/entities/user.entity';
import { EntityManager, IsNull, Not, Repository, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';


import { MailService } from './mail/mail.service';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { Role } from './roles/entities/role.entity';
import { RoleType } from './roles/entities/roles.enum';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
        //private readonly entityManager: EntityManager,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
        ){}
    
    //Helper function
    hashData(data: string){
        return bcrypt.hash(data, 10);
    }
    //The info we want to put into the json web token
    async getTokens(userId: number, email: string, roleName: string): Promise <Tokens>{
        const [at, rt] = await Promise.all([
        this.jwtService.signAsync(
            //Access Token
            {
                sub: userId,
                email,
                roleName: roleName
            },
            {
                secret: 'at-secret',
                expiresIn: 60 * 15,
            },
        ),
        //Refresh Token
        this.jwtService.signAsync(
            {
                sub: userId,
                email,
            },
            {
                secret: 'rt-secret',
                expiresIn: 60 * 60 * 24 * 7,
            },
        ),

    ]);//End promise

    //console.log("access token: "+at+ " and refresh token: "+rt)
    //Return object
        return {
            access_token: at,
            refresh_token: rt,
        };
    }
    async updateRtHash(userId: number, rt: string): Promise <any> 
    {
        //console.log("user id to update"+userId)
        const hash = await this.hashData(rt);
        //If the name of the field to be updated is the same as the name you set your variable to then you write update(userId, { hashedRt})
        await this.usersRepository.update(userId, { hashedRt: hash });
    }

    async signIn(userDTO: CreateUserDto): Promise<any>{
        try{ 
           
        const retrievedUser = await this.usersRepository.findOneBy({ email: userDTO.email });
        console.log(retrievedUser);   
        if(!retrievedUser) throw new HttpException("Incorrect Credentials!", HttpStatus.FORBIDDEN);
        // the firt arggument is the plain text password, the second is the the hashed password in the database
        const passwordMatches = await bcrypt.compare(userDTO.password, retrievedUser.password);
        console.log('here'+passwordMatches);
        if (!passwordMatches) {
            return { "error": "Incorrect Credentials!"};
        }
        
        //Generating tokens
        const tokens = await this.getTokens(retrievedUser.id, retrievedUser.email, retrievedUser.role_id.name);
        console.log('here2');
        await this.updateRtHash(retrievedUser.id, tokens.refresh_token);
        const { id, username, email, role_id } = retrievedUser;
        const user = {
          id,
          username,
          email,
          role: role_id.name // Rename the property to "role"
        };
        return {
            tokens,
            user
        };

        }catch(error){
           
            if (error instanceof HttpException) {
                // If it's already an HttpException, rethrow it directly
                throw error;
            } else {
                console.log(error)
                // If it's not an HttpException, create a new one with a dynamic response
                throw new HttpException(error.message, error.status);
            }
        }
    }
   
    async logout(userId: number){
        try{
            //Checking if a user exists with that email
            const user = await this.usersRepository.findOneBy({ id: userId });

            //console.log("value = "+user);
            if (user.hashedRt===null) {
                //console.log('Email already exists');
                // User already logged out, throw a custom exception
                throw new HttpException('User already logged out!', HttpStatus.BAD_REQUEST);
            }
            const result = await this.usersRepository.update(
                { id: userId, hashedRt: Not(IsNull()) },
                { hashedRt: null }
        );    
        //Success
        return {
            message: 'User Logout Successfull!'
        }
        } catch (error) {
            //console.error(error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(error.message, error.status);
            }
        }
    }

    async refreshTokens(userId: number, rt: string){
        try{
            const user = await this.usersRepository.findOneBy({ id: userId });   
            if(!user || !user.hashedRt) throw new ForbiddenException("Access denied");
            const rtMatches = await bcrypt.compare(rt, user.hashedRt);

            const tokens = await this.getTokens(user.id, user.email, user.role_id.name);
            await this.updateRtHash(user.id, tokens.refresh_token);
            return tokens;
            }catch(error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException("Internal server error!", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async resetPassword(userEmail: string){
        try{
            console.log('here');
            //Condition 1
            //Check if user exists
            const user = await this.usersRepository.findOneBy({ email: userEmail });
            //console.log(user.passwordResetToken !==null);   
            //console.log(user.resetPasswordExpirationToken !==null); 
            //If not exists
            if(!user) throw new HttpException("No user is registered under the email '"+userEmail+"'", HttpStatus.NOT_FOUND);
            
            //Condition 2
            //check if user already generated reset pasword token if so use that do not generate anything else field is null after every reset you must set it to null
            // *also check if it is expired or not et the time as variable from config
           
            if(user.passwordResetToken !==null && user.resetPasswordExpirationToken.getTime !==null){
                const currentTimeInMs = Date.now();
                const tokenExpirationTimeInMs =  user.resetPasswordExpirationToken.getTime();
                const timeLeft  = tokenExpirationTimeInMs - currentTimeInMs;
                console.log("Current time: "+currentTimeInMs);
                console.log("Expiration time: "+tokenExpirationTimeInMs);
                console.log("Timeleft MS : "+timeLeft);
                console.log("Timeleft S : "+timeLeft/1000);
                if (timeLeft > 0) {
                    // There is time left before expiration
                    console.log(`Time left: ${timeLeft /1000/60} minutes`);
                    throw new HttpException("A reset password email has already been sent to '"+userEmail+"', you need to wait '"+timeLeft/1000+"' seconds before requesting a new one", HttpStatus.UNAUTHORIZED);
                }    
                   
            }
            console.log("Outside of if");
            // The token has either expired or user rest his token for the first time
            //if (currentTimeInMs > tokenExpirationTimeInMs)
            console.log("Token has expired")
            //else user exists and does not have an existing pwd token
            user.passwordResetToken = null;
            user.resetPasswordExpirationToken = null;
            await this.usersRepository.save(user);
            
            //Condition 3        
            //exit loop only if the generated token is 100% unique
            while(true){
                //generating unique random bytes - read comments on said function for more details
                var generatedResetPasswordToken = await this.generateCustomToken();
                var resetPasswordTokenExists = await this.usersRepository.findOneBy({ passwordResetToken: generatedResetPasswordToken });
                
                //Checking is unique value exists:
                if(!resetPasswordTokenExists){
                    console.log("unique");
                    break;
                }
            }
            //Updating user
            user.passwordResetToken = generatedResetPasswordToken;
            user.resetPasswordExpirationToken = new Date(Date.now() + (300 * 1000));
            await this.usersRepository.save(user);
            console.log("Sending Reset Password Email...");
            return await this.mailService.sendResetPasswordEmail(user);      

        }catch(error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                console.log(error);
                throw new HttpException("Internal server error!", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    /*
     The randomBytes function is designed to provide cryptographically secure random values,
     which means that it should be highly unpredictable and difficult to reproduce.
     The likelihood of generating the same token is extremely low, but it's not completely impossible.
    */
    async generateCustomToken(): Promise<string> {
        return new Promise((resolve, reject) => {
          randomBytes(32, (err, buffer) => {
            //console.log("before converting: ", buffer)
            // Output : <Buffer 09 c6 b8 38 33 c2 c1 65 3d 6f 58 08 b6 9e 09 68 ec b8 bf 1d 60 c2 6e 25 be d3 a0 5d 3b 08 b8 00>
            if (err) {
              reject("Error generating token");
            }
            resolve(buffer.toString('hex'));
            //console.log("After converting: ", buffer.toString('hex) value)
            // Output: 09c6b83833c2c1653d6f5808b69e0968ecb8bf1d60c26e25bed3a05d3b08b800
          });
        });
    }
    async newPassword(userNewPassword: string, passwordResetToken: string){
        try {
        if (!userNewPassword || !passwordResetToken) {
            throw new HttpException('Please provide a password with a token', HttpStatus.BAD_REQUEST);
        }
        
        // Find user by reset password token and check if token is still valid
        const user = await this.usersRepository.findOneBy({ 
            passwordResetToken: passwordResetToken
        });
        if (!user) {
            throw new HttpException('No reset password initiated by this user!', HttpStatus.CONFLICT);
        }
        //Checking token experation time aka => validty
        if(user.passwordResetToken !==null && user.resetPasswordExpirationToken.getTime !==null){
            const currentTimeInMs = Date.now();
            const tokenExpirationTimeInMs =  user.resetPasswordExpirationToken.getTime();
            const timeLeft  = tokenExpirationTimeInMs - currentTimeInMs;
          
            if (timeLeft < 0) {
                throw new HttpException("Your reset password token for the email '"+user.email+"', has expired, you must reset it again!", HttpStatus.UNAUTHORIZED);
            }      
        }

        //Hashing password
        const hashedPassword = await this.hashData(userNewPassword);
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.resetPasswordExpirationToken = null;

        const savedUser = await this.usersRepository.save(user);
        if(savedUser){
            return { 
                message: 'Password updated, you can now login using your new password!'
             };
        }else{
            return { 
                message: 'Error while updating user password'
             };
        }
        
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                console.log(error);
                throw new HttpException("Internal server error!", HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }
      }
    

}
