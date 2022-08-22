import { Injectable } from '@nestjs/common';
import { BookEntity } from "./entities/book.entity";
import { TitleEntity } from "./entities/title.entity";
import { TitleAuthorEntity } from "./entities/title-author.entity";
import { BookState, GetAllBooksRespons, GetUserBooksRespons } from "../types";

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
}
