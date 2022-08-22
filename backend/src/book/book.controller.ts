import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { BookService } from "./book.service";
import { SetAccessForRoles } from "../decorators/set-access-for-roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AccessForRolesProtectGuard } from "../guards/access-for-roles-protect.guard";
import { GetAllBooksRespons } from "../types";

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
    async getAll(): Promise<GetAllBooksRespons> {
        return this.bookService.getAll();
    }
}
