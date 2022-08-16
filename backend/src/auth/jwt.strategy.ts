import {Strategy} from 'passport-jwt';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { authConfig } from "../../config/auth-config";
import { UserEntity } from "../user/entities/user.entity";

export interface JwtPayload {
    id: string;
}

function cookieExtractor(req: any): null | string {
    return (req && req.cookies) ? (req.cookies?.jwt ?? null) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: authConfig.secretOrKey,
        });
    }

    async validate(payload: JwtPayload, done: (error, user) => void) {
        if(!payload || !payload.id) {
            return done(new UnauthorizedException(), false);
        }

        const user = await UserEntity.findOne({
            where: {
                currentTokenId: payload.id,
            }
        });

        if(!user) {
            return done(new UnauthorizedException(), false);
        }

        done(null, user);
    }
}