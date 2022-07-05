import {BookEntity} from "./book.entity";
import {pool} from "../utils/db";

export class BookRecord implements BookEntity {
    id: number;
    name_surname: string;
    title: string;
    state: string;
    return_until?: string;

    constructor(obj: BookEntity) {
        this.id = obj.id;
        this.name_surname = obj.name_surname;
        this.title = obj.title;
        this.state = obj.state;
        this.return_until = obj.return_until;
    };

    static async findAll(): Promise<BookEntity[] | null> {
        const [results]: any = await pool.execute(
            "SELECT `books`.`id`, `name_surname`, `title`, `book_states`.`name` AS `state`" +
            "FROM `books`, `book_authors`, `book_titles`, `book_states`" +
            "WHERE `books`.`author1_id` = `book_authors`.`id`" +
            "AND `books`.`title_id` = `book_titles`.`id`" +
            "AND `books`.`book_state_id`= `book_states`.`id`");

        return results.length === 0 ? null : results.map((item: any) => new BookRecord(item));
    };

    static async findForUser(id: string): Promise<BookEntity[] | null> {
        const [results]: any = await pool.execute(
            "SELECT `books`.`id`, `name_surname`, `title`, `book_states`.`name` AS `state`, `return_until`" +
            "FROM `books`, `book_authors`, `book_titles`, `book_states`" +
            "WHERE `books`.`author1_id` = `book_authors`.`id`" +
            "AND `books`.`title_id` = `book_titles`.`id`" +
            "AND `books`.`book_state_id`= `book_states`.`id`" +
            "AND `books`.`user_id` = :user_id;", {
                user_id: id,
            });

        return results.length === 0 ? null : results.map((item: any) => new BookRecord(item));
    };
};