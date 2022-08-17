import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { RegisterUserResponse } from "../types";
import { UserService } from "./user.service";
import { SetAccessForRoles } from "../decorators/set-access-for-roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AccessForRolesProtectGuard } from "../guards/access-for-roles-protect.guard";

@Controller('/api/v1/users')
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

    @Get('/test-user')
    @SetAccessForRoles(['user'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    testUser() {
        return 'test-user';
    }

    @Get('/test-admin')
    @SetAccessForRoles(['admin'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    testAdmin() {
        return 'test-admin';
    }

    @Get('/test-user-admin')
    @SetAccessForRoles(['user', 'admin'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    testUserAdmin() {
        return 'test-user-admin';
    }
}
