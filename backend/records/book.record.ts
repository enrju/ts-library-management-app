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

    static async find(id: string): Promise<BookRecord | null> {
        const [results]: any = await pool.execute(
            "SELECT `books`.`id`, `name_surname`, `title`, `book_states`.`name` AS `state`, `return_until`" +
            "FROM `books`, `book_authors`, `book_titles`, `book_states`" +
            "WHERE `books`.`author1_id` = `book_authors`.`id`" +
            "AND `books`.`title_id` = `book_titles`.`id`" +
            "AND `books`.`book_state_id`= `book_states`.`id`" +
            "AND `books`.`id` = :id;", {
                id: id,
            }
        );

        return results.length === 0 ? null : new BookRecord(results[0]);
    }

    static async findAll(): Promise<BookEntity[] | []> {
        const [results]: any = await pool.execute(
            "SELECT `books`.`id`, `name_surname`, `title`, `book_states`.`name` AS `state`" +
            "FROM `books`, `book_authors`, `book_titles`, `book_states`" +
            "WHERE `books`.`author1_id` = `book_authors`.`id`" +
            "AND `books`.`title_id` = `book_titles`.`id`" +
            "AND `books`.`book_state_id`= `book_states`.`id`");

        return results.length === 0 ? [] : results.map((item: any) => new BookRecord(item));
    };

    static async findForUser(id: string): Promise<BookEntity[] | []> {
        const [results]: any = await pool.execute(
            "SELECT `books`.`id`, `name_surname`, `title`, `book_states`.`name` AS `state`, `return_until`" +
            "FROM `books`, `book_authors`, `book_titles`, `book_states`" +
            "WHERE `books`.`author1_id` = `book_authors`.`id`" +
            "AND `books`.`title_id` = `book_titles`.`id`" +
            "AND `books`.`book_state_id`= `book_states`.`id`" +
            "AND `books`.`user_id` = :user_id;", {
                user_id: id,
            });

        return results.length === 0 ? [] : results.map((item: any) => new BookRecord(item));
    };

    async update(state: string, user_id: string = 'NULL'): Promise<void> {
        if(!this.id) {
            throw new Error('Book has no ID');
        }

        let state_id = 1;

        switch(state) {
            case 'available':
                state_id = 1;
                break;
            case 'reserved':
                state_id = 2;
                break;
            case 'rented':
                state_id = 3;
                break;
        }

        if(user_id === 'NULL' && state_id === 1) {
            await pool.execute(
                "UPDATE `books` SET " +
                "`book_state_id` = :state_id, " +
                "`user_id` = NULL, " +
                "`return_until` = NULL " +
                "WHERE id = :id", {
                    id: this.id,
                    state_id: state_id,
                });
        } else {
            let date;
            if(state_id === 2) {
                date = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
            } else if(state_id === 3) {
                date = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000);
            } else {
                return;
            }

            await pool.execute(
                "UPDATE `books` SET " +
                "`book_state_id` = :state_id, " +
                "`user_id` = :user_id, " +
                "`return_until` = :date " +
                "WHERE id = :id", {
                    id: this.id,
                    state_id: state_id,
                    user_id: user_id,
                    date: date,
                });
        }
    };
};