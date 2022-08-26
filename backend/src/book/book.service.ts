import { Injectable } from '@nestjs/common';
import { BookEntity } from "./entities/book.entity";
import { TitleEntity } from "./entities/title.entity";
import { TitleAuthorEntity } from "./entities/title-author.entity";
import {
    BookState,
    CreateBookResponse,
    GetAllBooksResponse,
    GetOneBookResponse,
    GetUserBooksResponse, UpdateBookResponse,
    UpdateBookStateResponse
} from "../types";
import { appConfig } from "../../config/app-config";
import { UserEntity } from "../user/entities/user.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { AuthorEntity } from "./entities/author.entity";
import { UpdateBookDto } from "./dto/update-book.dto";

type AllBooksFullData = {
    id: number;
    title: string;
    author: string;
    state: BookState;
    returnUntil: Date | null;
    userId: string | null;
}[];

@Injectable()
export class BookService {
    private async getAllFullData(): Promise<AllBooksFullData> {
        const titleAuthor = (await TitleAuthorEntity
            .find({
                select: {
                    id: true,
                    titleEntity: {
                        id: true,
                        title: true,
                    },
                    authorEntity: {
                        name: true,
                        surname: true,
                    }
                },
                relations: ['titleEntity', 'authorEntity']
            }))
            .map(item => ({
                id: item.titleEntity.id,
                title: item.titleEntity.title,
                author: item.authorEntity.name + ' ' + item.authorEntity.surname,
            }));

        const allTitleWithAuthors = (await TitleEntity
            .find())
            .map(title => {
                let allAuthors = "";
                titleAuthor.forEach(titleAuthor => {
                    if(titleAuthor.id === title.id) {
                        if(allAuthors.length > 0) {
                            allAuthors += ', ' + titleAuthor.author;
                        } else {
                            allAuthors += titleAuthor.author;
                        }
                    }
                });

                return {
                    ...title,
                    author: allAuthors
                }
            });

        const allBooks = (await BookEntity
            .find({
                select: {
                    id: true,
                    titleEntity: {
                        id: true,
                        title: true,
                    },
                    state: true,
                    return_until: true,
                    userEntity: {
                        id: true,
                    }
                },
                relations: ['titleEntity', 'userEntity']
            }))
            .map(book => {
                let author = "";
                allTitleWithAuthors
                    .forEach(titleWithAuthor => {
                        if(book.titleEntity.id === titleWithAuthor.id) {
                            author = titleWithAuthor.author;
                        }
                    });

                return {
                    id: book.id,
                    title: book.titleEntity.title,
                    author,
                    state: book.state,
                    returnUntil: book.return_until,
                    userId: book.userEntity ? book.userEntity.id : null,
                }
            });

        return allBooks;
    }

    async getAll(): Promise<GetAllBooksResponse> {
        try {
            const allBooksFiltered =
                (await this.getAllFullData())
                .map(item => ({
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    state: item.state,
                }));

            return {
                isSuccess: true,
                data: allBooksFiltered,
            };
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }

    }

    async getUserBooks(userId: string): Promise<GetUserBooksResponse> {
        try {
            const userBooksFiltered =
                (await this.getAllFullData())
                .filter(item => item.userId === userId)
                .map(item => ({
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    state: item.state,
                    returnUntil: item.returnUntil,
                }));

            return {
                isSuccess: true,
                data: userBooksFiltered,
            };
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }
    }

    private async changeState(bookId: number, bookState: BookState, userId: string | null = null): Promise<void> {
        const book = await BookEntity.findOneOrFail({
            where: {
                id: bookId,
            }
        });

        if(book) {
            if(!userId) {
                book.state = bookState;
                book.return_until = null;
                book.userEntity = null;

                await book.save();

            } else {
                const user = await UserEntity.findOneOrFail({
                    where: {
                        id: userId,
                    }
                });

                let validDate = null;
                switch (bookState) {
                    case BookState.Reserved:
                        validDate = new Date(new Date().getTime() + appConfig.bookReservationPeriod);
                        break;
                    case BookState.Rented:
                        validDate = new Date(new Date().getTime() + appConfig.bookRentPeriod);
                        break;
                }

                book.state = bookState;
                book.return_until = validDate;
                book.userEntity = user ? user : null;

                await book.save();

            }
        } else {
            throw new Error("This book don't exist");
        }
    }

    async userChangeState(bookId: number, bookState: BookState, userId: string | null = null): Promise<UpdateBookStateResponse> {
        try {
            switch (bookState) {
                case BookState.Available:
                    await this.changeState(bookId, bookState, null);

                    return {
                        isSuccess: true,
                    };
                case BookState.Reserved:
                    await this.changeState(bookId, bookState, userId);

                    return {
                        isSuccess: true,
                    };
                default:
                    throw new Error('Illegal action!');
            }
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }
    }

    async adminChangeState(bookId: number, bookState: BookState): Promise<UpdateBookStateResponse> {
        try {
            switch (bookState) {
                case BookState.Available:
                    await this.changeState(bookId, bookState, null);

                    return {
                        isSuccess: true,
                    };
                case BookState.Rented:
                    const book = await BookEntity.findOneOrFail({
                        relations: ['userEntity'],
                        where: {
                            id: bookId,
                        }
                    });

                    if(book) {
                        await this.changeState(bookId, bookState, book.userEntity.id);

                        return {
                            isSuccess: true,
                        };
                    } else {
                        throw new Error('This book is not exist');
                    }
                default:
                    throw new Error('Illegal action!');
            }
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }
    }

    async create(createBookDto: CreateBookDto): Promise<CreateBookResponse> {
        try {
            let titleEntity: TitleEntity = null;
            let authorEntities: AuthorEntity[] = [];

            const existingTitle = await TitleEntity.findOne({
                where: {
                    title: createBookDto.title,
                }
            });

            if(!existingTitle) {
                const title = new TitleEntity();
                title.title = createBookDto.title;
                await title.save();

                titleEntity = title;
            } else {
                titleEntity = existingTitle;
            }

            for(let i = 0; i < createBookDto.author.length; i++) {
                const existingAuthor = await AuthorEntity.findOne({
                    where: {
                        name: createBookDto.author[i].name,
                        surname: createBookDto.author[i].surname,
                    }
                });

                if(!existingAuthor) {
                    const author = new AuthorEntity();
                    author.name = createBookDto.author[i].name;
                    author.surname = createBookDto.author[i].surname;
                    await author.save();

                    authorEntities.push(author);
                } else {
                    authorEntities.push(existingAuthor);
                }
            }

            for(let i = 0; i < authorEntities.length; i++) {
                const existingTitleAuthor = await TitleAuthorEntity.findOne({
                    relations: ['titleEntity', 'authorEntity'],
                    where: {
                        titleEntity: titleEntity.valueOf(),
                        authorEntity: authorEntities[i].valueOf(),
                    }
                });

                if(!existingTitleAuthor) {
                    const titleAuthor = new TitleAuthorEntity();
                    titleAuthor.titleEntity = titleEntity;
                    titleAuthor.authorEntity = authorEntities[i];
                    await titleAuthor.save();
                }
            }

            const newBook = new BookEntity();
            newBook.titleEntity = titleEntity;
            await newBook.save();

            return {
                isSuccess: true,
            }
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }
    }

    private async getOneFiltered(bookId: number): Promise<any> {
        const book = await BookEntity.findOne({
            relations: ['titleEntity'],
            where: {
                id: bookId,
            }
        });

        const titleAuthor = await TitleAuthorEntity
            .find({
                relations: ['titleEntity', 'authorEntity'],
                where: {
                    titleEntity: book.titleEntity.valueOf(),
                }
            });

        return {
            id: book.id,
            title: {
                id: book.titleEntity.id,
                title: book.titleEntity.title,
            },
            author: titleAuthor.map(item => ({
                id: item.authorEntity.id,
                name: item.authorEntity.name,
                surname: item.authorEntity.surname,
            })),
        };
    }

    async getOne(bookId: number): Promise<GetOneBookResponse> {
        try {
            const book = await this.getOneFiltered(bookId);

            return {
                isSuccess: true,
                data: book,
            };
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }
    }

    async update(bookId: number, updateBookDto: UpdateBookDto): Promise<UpdateBookResponse> {
        try {
            const titleEntity = await TitleEntity.findOne({
                where: {
                    id: updateBookDto.title.id,
                }
            });

            titleEntity.title = updateBookDto.title.title;
            await titleEntity.save();

            for(let i = 0; i < updateBookDto.author.length; i++) {
                const authorEntity = await AuthorEntity.findOne({
                    where: {
                        id: updateBookDto.author[i].id,
                    }
                });

                authorEntity.name = updateBookDto.author[i].name;
                authorEntity.surname = updateBookDto.author[i].surname;
                await authorEntity.save();
            }

            return {
                isSuccess: true,
            }
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }
    }
}
