import { BookAuthor, UpdateBookRequest } from "../../types";

export class UpdateBookDto implements UpdateBookRequest {
    title: {id: number, title: string};
    author: BookAuthor[];
}