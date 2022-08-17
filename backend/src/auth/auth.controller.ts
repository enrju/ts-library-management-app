import { Body, Controller, Get, Inject, Post, Res, UseGuards } from "@nestjs/common";
import {Response} from 'express';
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { LoginAuthResponse, LogoutAuthResponse } from "../types";
import { AuthGuard } from "@nestjs/passport";
import { UserEntity } from "../user/entities/user.entity";
import { UserObj } from "../decorators/user-obj.decorator";

@Controller('/auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private authService: AuthService,
    ) {
    }

    @Post('/login')
    async login(
        @Body() loginAuthDto: LoginAuthDto,
        @Res() res: Response,
    ): Promise<LoginAuthResponse> {
        return this.authService.login(loginAuthDto, res);
    }

    @Get('/logout')
    @UseGuards(AuthGuard('jwt'))
    async logout(
        @UserObj() user: UserEntity,
        @Res() res: Response,
    ): Promise<LogoutAuthResponse> {
        return this.authService.logout(user, res);
    }
}
