import { BookAuthor, CreateBookRequest } from "../../types";

export class CreateBookDto implements CreateBookRequest {
    title: string;
    author: BookAuthor[];
}