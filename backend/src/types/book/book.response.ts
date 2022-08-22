import { BookState } from "./book.type";

export interface LibraryBook {
    id: number;
    title: string;
    author: string;
    state: BookState;
}

export type GetAllBooksRespons = {
    isSuccess: true;
    data: LibraryBook[];
} | {
    isSuccess: false;
    msgError: string;
}