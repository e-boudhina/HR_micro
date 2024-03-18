import { AuthGuard } from "@nestjs/passport";

export class RtGuard extends AuthGuard('jwt-refresh'){
    constructor(){
        //when you extend something you must use super
        super();
    }
}