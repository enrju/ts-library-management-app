import { Body, Controller, Get, Inject, Param, Post, UseGuards } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { GetUserBooksRespons, RegisterUserResponse } from "../types";
import { UserService } from "./user.service";
import { SetAccessForRoles } from "../decorators/set-access-for-roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AccessForRolesProtectGuard } from "../guards/access-for-roles-protect.guard";
import { UserObj } from "../decorators/user-obj.decorator";
import { UserEntity } from "./entities/user.entity";

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

    @Get('/id/books')
    @SetAccessForRoles(['user'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    async getUserBooks(
        @UserObj() user: UserEntity,
    ): Promise<GetUserBooksRespons> {
        return this.userService.getUserBooks(user.id);
    }

    @Get('/:id/books')
    @SetAccessForRoles(['admin'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    async adminGetUserBooks(
        @Param('id') userId: string
    ): Promise<GetUserBooksRespons> {
        return this.userService.getUserBooks(userId);
    }
}
