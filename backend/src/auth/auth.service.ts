import { Injectable } from '@nestjs/common';
import {Response} from 'express';
import { LoginAuthDto } from "./dto/login-auth.dto";
import { UserEntity } from "../user/entities/user.entity";
import { checkHash } from "../utils/hash";
import { JwtPayload } from "./jwt.strategy";
import { sign } from "jsonwebtoken";
import { authConfig } from "../../config/auth-config";
import {v4 as uuid} from 'uuid';
import { LoginAuthResponse } from "../types";

@Injectable()
export class AuthService {
    private createToken(currentTokenId: string): {accessToken: string, expiresIn: number} {
        const payload: JwtPayload = {id: currentTokenId};
        const expiresIn = authConfig.tokenExpiresIn;
        const accessToken = sign(payload, authConfig.secretOrKey, {expiresIn});

        return {
            accessToken,
            expiresIn,
        }
    }

    private async generateToken(user: UserEntity): Promise<string> {
        let token;
        let userWithThisToken = null;

        do {
            token = uuid();
            userWithThisToken = await UserEntity.findOne({
                where: {
                    currentTokenId: token,
                }
            });
        } while(!!userWithThisToken);

        user.currentTokenId = token;
        await user.save();

        return token;
    }

    async login(loginAuthDto: LoginAuthDto, res: Response): Promise<any> {
        try {
            const user = await UserEntity.findOne({
                where: {
                    email: loginAuthDto.email,
                }
            });

            if(!user) {
                return res.json({
                    isSuccess: false,
                    msgError: 'Invalid login data',
                });
            }

            if(user && await checkHash(loginAuthDto.password, user.passwordHash) === false) {

                return res.json({
                    isSuccess: false,
                    msgError: 'Invalid password data',
                });
            }

            const token = this.createToken(await this.generateToken(user));

            return res
                .cookie('jwt', token.accessToken, {
                    secure: false,
                    domain: authConfig.jwtCookieDomain,
                    httpOnly: true,
                })
                .cookie('logged', true)
                .cookie('role', user.role)
                .json({
                    isSuccess: true,
                });
        } catch(e) {
            return res.json({
                isSuccess: false,
                msgError: e.message
            });
        }
    }
}
