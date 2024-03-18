import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types";
import { Request } from "express";

//why do we need to add them to providers if they are injectables
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            //ignoreExpiration: true,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    console.log('extracting')
                    console.log(req.cookies['access_token']);
                    // Your custom logic to extract the token from cookies
                    return req.cookies?.access_token || null;
                },
            ]),
            secretOrKey: 'at-secret',
    });
    }

    /*
    private static extractJWT(req: Request): string | null {
        console.log("extracting");
        if (req.cookies && 'access_token' in req.cookies && req.cookies.access_token.length > 0) {
            return req.cookies.access_token;
        }
        return null;
    }
    */
async validate(payload: JwtPayload) {
    console.log('Decoded token payload:', payload);
    if (!payload) {
        // dig into this since the defualt message is still unautorized and not the content within the message
        throw new UnauthorizedException('Invalid or missing token payload');
    }
    return payload;
    //it will put req.user = payload; attached it
}
    
}
