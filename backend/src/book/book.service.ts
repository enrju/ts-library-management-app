import { Injectable } from '@nestjs/common';
import { BookEntity } from "./entities/book.entity";
import { TitleEntity } from "./entities/title.entity";
import { TitleAuthorEntity } from "./entities/title-author.entity";
import { GetAllBooksRespons } from "../types";

@Injectable()
export class BookService {
    async getAll(): Promise<GetAllBooksRespons> {
        try {
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
                    relations: ['titleEntity']
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
                    }
                });

            return {
                isSuccess: true,
                data: allBooks,
            };
        } catch(e) {
            return {
                isSuccess: false,
                msgError: e.message,
            };
        }

    }
}
