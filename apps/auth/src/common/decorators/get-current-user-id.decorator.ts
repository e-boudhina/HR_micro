import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtPayload } from "../types";

export const GetCurrentUserId = createParamDecorator(
   /* what's that "_" in the line */
     (_: undefined, context: ExecutionContext): number => {   
    //( data: undefined, context: ExecutionContext): number => {
      const request = context.switchToHttp().getRequest();
      //console.log("request: ");
      //console.log(request);
      
      const user = request.user as JwtPayload;
      //console.log("User: ");
      //console.log(user);
      // Check if user is defined and has a 'sub' property
           if (!user || !user.sub) {
            throw new Error("User or user.sub is undefined");
          }

      return user.sub;
    },
  );