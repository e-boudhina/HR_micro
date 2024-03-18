import { Body, Controller, ForbiddenException, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./users/dto/create-user.dto";
import { Tokens } from "./types/tokens.type";

import { Request, Response } from "express";
//no need for this since we difined them in Guards
//import { AuthGuard } from "@nestjs/passport";
import { AtGuard, RtGuard} from "./common/guards";
import { GetCurrentUser, GetCurrentUserId } from "./common/decorators";
import { Public } from "./common/decorators/public.decorator";
import { Role } from "./roles/entities/role.entity";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){
    }
    
    @Public()
    @Post('/signin')
    
    async signin(@Body() userDTO: CreateUserDto, @Res({passthrough: true}) response: Response)
    {
        try{
            const signinResponse = await this.authService.signIn(userDTO);
        
            if ('error' in signinResponse) {
              // Handle the case where an error object is returned
              return { "error": signinResponse.error };
            }
            console.log("returned results");
            console.log(signinResponse);
            /*
            the HttpOnly attribute prevents JavaScript from accessing the cookie through the document.
            cookie property. It is a security feature designed to mitigate
            the risk of cross-site scripting (XSS) attacks.

            the secure attribute to true for cookies that contain sensitive information.
            This ensures that the cookie is only transmitted over secure connections.
            */
            // Set HTTP-only cookies in the response
            const accessTokenExpirationDate = new Date();
            accessTokenExpirationDate.setTime(accessTokenExpirationDate.getTime() + 15 * 60 * 1000); // Expires in 7 days (7 * 24 * 60 * 60 * 1000 milliseconds) 
            response.cookie('access_token', signinResponse.tokens.access_token, {
                httpOnly: true, // prevents document.cookie to be read from the client browser lower Xcrf attacks
                // if there is an issure below comment it 
                secure: true,
                sameSite: 'strict',
                expires: accessTokenExpirationDate
                // other cookie options...
            });
            
            const refreshTokenExpirationDate = new Date();
            refreshTokenExpirationDate.setTime(refreshTokenExpirationDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days (7 * 24 * 60 * 60 * 1000 milliseconds)
            response.cookie('refresh_token', signinResponse.tokens.refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                expires: refreshTokenExpirationDate
            });
            
            return signinResponse;
      //return tokens;
        }catch(error){
            return { error: 'Failed to authenticate, try later.' };

        }
        
    }

    //logout wihtout decorator
    /*
    //jwt is the name of the strategy
    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    // check the diffrence between request from enst js and express js
    logout(@Req() req: Request)
    {   
        //console.log(req.user['sub']);
        //const authorizationHeader = req.headers['authorization'];
        //console.log('Authorization Header:', authorizationHeader);
        const user = req.user;
        if (!user) {
            // Handle the case where user or user.id is undefined
            throw new ForbiddenException("Invalid user information");
        }
        return this.authService.logout(user['sub']);
    }
    */
    
    //we moved this globally
    
    //@Public()
    @Post('logout')
    //Logout with decorator
    logout(@GetCurrentUserId() userId: number)
    {   
        return this.authService.logout(userId);
    }
    //refresh tokens without decorators
    /*
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req: Request)
    {
        console.log("refresh token");
        console.log(req.user['sub']);
        const authorizationHeader = req.headers['authorization'];
        const user = req.user;
        return this.authService.refreshTokens(user['sub'], user['refreshToken']);

    }
    */
    // Since we have AtGUard set up globally we need to use public here to by pass it and then use custom refresh guard here
    @Public() 
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUser('refreshToken') refreshToken: string)
    {
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @Public()
    @Post('test')
    testapi(@Req() req: Request)
    {
      return "Testing function";
    }

    @Public()
    @Post('reset-password')
    async resetPassword(@Res() res: Response, @Body() requestBody: { email: string })
    {
      const userEmail = requestBody.email;
      const result =  await this.authService.resetPassword(userEmail);
      return res.status(result.statusCode).send({
        statusCode : result.statusCode,
        message: result.message
    });
    }

    @Public()
    @Post('new-password/:reset_password_token')
    newPassword(@Param('reset_password_token') passwordResetToken: string, @Body() requestBody: { newPassword: string})
    {
     const userNewPassword = requestBody.newPassword;
     return this.authService.newPassword(userNewPassword, passwordResetToken);
    }

    @Public()
    @Post('test/:reset_password_token')
    test(@Param('reset_password_token') passwordResetToken: string) {
        return passwordResetToken;
    }
}