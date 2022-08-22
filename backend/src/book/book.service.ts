import { Injectable } from '@nestjs/common';
import { BookEntity } from "./entities/book.entity";
import { TitleEntity } from "./entities/title.entity";
import { TitleAuthorEntity } from "./entities/title-author.entity";
import { BookState, GetAllBooksRespons, GetUserBooksRespons, UpdateBookStateRespons } from "../types";
import { appConfig } from "../../config/app-config";
import { UserEntity } from "../user/entities/user.entity";

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

    async getAll(): Promise<GetAllBooksRespons> {
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

    async getUserBooks(userId: string): Promise<GetUserBooksRespons> {
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

    async userChangeState(bookId: number, bookState: BookState, userId: string | null = null): Promise<UpdateBookStateRespons> {
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
                    return {
                        isSuccess: false,
                        msgError: 'Illegal action!',
                    };
            }
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }
    }

    async adminChangeState(bookId: number, bookState: BookState): Promise<UpdateBookStateRespons> {
        try {

        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }
    }
}
