import { BookState } from "./book.type";
import { BookAuthor } from "./book.request";

export interface Book {
    id: number;
    title: {id: number, title: string};
    author: BookAuthor[];
}

export interface LibraryBook {
    id: number;
    title: string;
    author: string;
    state: BookState;
}

export interface UserBook extends LibraryBook {
    returnUntil: Date | null;
}

export type GetAllBooksResponse = {
    isSuccess: true;
    data: LibraryBook[];
} | {
    isSuccess: false;
    msgError: string;
}

export type GetUserBooksResponse = {
    isSuccess: true;
    data: UserBook[];
} | {
    isSuccess: false;
    msgError: string;
}

export type GetOneBookResponse = {
    isSuccess: true;
    data: Book;
} | {
    isSuccess: false;
    msgError: string;
}

export type UpdateBookStateResponse = {
    isSuccess: true;
} | {
    isSuccess: false;
    msgError: string;
}

export type CreateBookResponse = {
    isSuccess: true;
} | {
    isSuccess: false;
    msgError: string;
}

export type UpdateBookResponse = {
    isSuccess: true;
} | {
    isSuccess: false;
    msgError: string;
}

export type DeleteBookResponse = {
    isSuccess: true;
} | {
    isSuccess: false;
    msgError: string;
}