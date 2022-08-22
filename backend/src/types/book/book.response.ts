import { BookState } from "./book.type";

export interface LibraryBook {
    id: number;
    title: string;
    author: string;
    state: BookState;
}

export interface UserBook extends LibraryBook {
    returnUntil: Date | null;
}

export type GetAllBooksRespons = {
    isSuccess: true;
    data: LibraryBook[];
} | {
    isSuccess: false;
    msgError: string;
}

export type GetUserBooksRespons = {
    isSuccess: true;
    data: UserBook[];
} | {
    isSuccess: false;
    msgError: string;
}

export type UpdateBookStateRespons = {
    isSuccess: true;
} | {
    isSuccess: false;
    msgError: string;
}