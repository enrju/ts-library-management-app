import {
    Body,
    Controller, Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    UseGuards
} from "@nestjs/common";
import { BookService } from "./book.service";
import { SetAccessForRoles } from "../decorators/set-access-for-roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AccessForRolesProtectGuard } from "../guards/access-for-roles-protect.guard";
import {
    BookState,
    CreateBookResponse, DeleteBookResponse,
    GetAllBooksResponse,
    GetOneBookResponse, UpdateBookResponse,
    UpdateBookStateResponse,
    UserRole
} from "../types";
import { UserObj } from "../decorators/user-obj.decorator";
import { UserEntity } from "../user/entities/user.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

@Controller('/api/v1/books')
export class BookController {
    constructor(
        @Inject(BookService) private bookService: BookService,
    ) {
    }

    @Post('/')
    @SetAccessForRoles(['admin'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    async create(
        @Body() createBookDto: CreateBookDto,
    ): Promise<CreateBookResponse> {
        return this.bookService.create(createBookDto);
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

    @Get('/:id')
    @SetAccessForRoles(['admin'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    async getOne(
        @Param('id') bookId: number
    ): Promise<GetOneBookResponse> {
        return this.bookService.getOne(bookId);
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

    @Patch('/:id')
    @SetAccessForRoles(['admin'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    async update(
        @Param('id') bookId: number,
        @Body() updateBookDto: UpdateBookDto,
    ): Promise<UpdateBookResponse> {
        return this.bookService.update(bookId, updateBookDto);
    }

    @Delete('/:id')
    @SetAccessForRoles(['admin'])
    @UseGuards(
        AuthGuard('jwt'),
        AccessForRolesProtectGuard
    )
    async delete(
        @Param('id') bookId: number,
    ): Promise<DeleteBookResponse> {
        return this.bookService.delete(bookId);
    }
}
