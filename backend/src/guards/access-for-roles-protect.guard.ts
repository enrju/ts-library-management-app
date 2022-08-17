import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class AccessForRolesProtectGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const userRole = req.user.role;

        const accessForRoles = this.reflector.get<string[]>('accessForRole', context.getHandler());

        if(accessForRoles.includes(userRole)) return true;
        else return false;
    }
}