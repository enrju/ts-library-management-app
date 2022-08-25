export interface BookAuthor {
    name: string;
    surname: string;
}

export interface CreateBookRequest {
    title: string;
    author: BookAuthor[];
}