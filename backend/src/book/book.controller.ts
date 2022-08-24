import { Controller, Get, Inject, Param, Patch, UseGuards } from "@nestjs/common";
import { BookService } from "./book.service";
import { SetAccessForRoles } from "../decorators/set-access-for-roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AccessForRolesProtectGuard } from "../guards/access-for-roles-protect.guard";
import { BookState, GetAllBooksResponse, UpdateBookStateResponse, UserRole } from "../types";
import { UserObj } from "../decorators/user-obj.decorator";
import { UserEntity } from "../user/entities/user.entity";

@Controller('/api/v1/books')
export class BookController {
    constructor(
        @Inject(BookService) private bookService: BookService,
    ) {
    }

    @Get('/')
    @SetAccessForRoles(['user', 'admin'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    async getAll(): Promise<GetAllBooksResponse> {
        return this.bookService.getAll();
    }

    @Patch('/:id/state/:state')
    @SetAccessForRoles(['user', 'admin'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    async changeState(
        @Param('id') bookId: string,
        @Param('state') bookState: BookState,
        @UserObj() user: UserEntity,
    ): Promise<UpdateBookStateResponse> {
        switch(user.role) {
            case UserRole.User:
                return this.bookService.userChangeState(Number(bookId), bookState, user.id);
            case UserRole.Admin:
                return this.bookService.adminChangeState(Number(bookId), bookState);
        }
    }
}
