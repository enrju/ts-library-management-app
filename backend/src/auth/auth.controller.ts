import { Body, Controller, Inject, Post, Res } from "@nestjs/common";
import {Response} from 'express';
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { LoginAuthResponse } from "../types";

@Controller('/auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private authService: AuthService,
    ) {
    }

    @Post('/login')
    login(
        @Body() loginAuthDto: LoginAuthDto,
        @Res() res: Response,
    ): Promise<LoginAuthResponse> {
        return this.authService.login(loginAuthDto, res);
    }
}
