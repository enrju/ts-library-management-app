export interface BookEntity {
    id: number;
    name_surname: string;
    title: string;
    state: string;
    user_id?: string;
    return_until?: string;
};