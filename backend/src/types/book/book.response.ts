import { BookState } from "./book.type";

export interface Book {
    id: number;
    title: string;
    author: string;
    state: BookState;
}

export type GetAllBooksRespons = {
    isSuccess: true;
    data: Book[];
} | {
    isSuccess: false;
    msgError: string;
}