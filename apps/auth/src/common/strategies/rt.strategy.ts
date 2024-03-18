import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
//or you can use Request from nest js common and use @Request in your function

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(){
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'rt-secret',

    });
    }

    validate(req: Request, payload: any){
        //console.log("valdiation");
        //Removing "bearer" from the string
        const refreshToken = req.get('authorization').replace('Bearer','').trim();
        //it will put req.user = payload; attached it
        return {
            //Three dots 
            ...payload,
            refreshToken
        }
    }

    
}