import { Body, Controller, Inject, Post } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { RegisterUserResponse } from "../types";
import { UserService } from "./user.service";

@Controller('/user')
export class UserController {
    constructor(
        @Inject(UserService) private userService: UserService,
    ) {
    }

    @Post('/register')
    async register(
        @Body() registerUserDto: RegisterUserDto,
    ): Promise<RegisterUserResponse> {
        return await this.userService.register(registerUserDto);
    }
}
