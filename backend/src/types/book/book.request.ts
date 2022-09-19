export interface BookAuthor {
    id?: number;
    name: string;
    surname: string;
}

export interface CreateBookRequest {
    title: string;
    author: BookAuthor[];
}

export interface UpdateBookRequest {
    title: {id: number, title: string} | null;
    author: BookAuthor[];
}