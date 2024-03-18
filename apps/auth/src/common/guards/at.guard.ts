import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class AtGuard extends AuthGuard('jwt'){
    constructor(private reflector: Reflector){
        //when you extend something you must use super
        super();
    }//The way to check if a handler or a class has some metadata is to use a "reflector"
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic',[
            //check if it is present on the handler 
            context.getHandler(),
            //also check it on the class
            context.getClass()
        ]);
        if(isPublic){
        //bypass the guard (almost like next)
            return true;
        }
        //if not it will stay false
        return super.canActivate(context);
    }
}