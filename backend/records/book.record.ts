import {BookEntity} from "./book.entity";
import {pool} from "../utils/db";
import {AuthorRecord} from "./author.record";
import {TitleRecord} from "./title.record";
import {BookStateRecord} from "./book-state.record";

export class BookRecord implements BookEntity {
    id?: number;
    name_surname: string;
    title: string;
    state: string;
    user_id?: string;
    return_until?: string;

    constructor(obj: BookEntity) {
        if(obj.id) this.id = obj.id;
        this.name_surname = obj.name_surname;
        this.title = obj.title;
        this.state = obj.state;
        this.user_id = obj.user_id;
        this.return_until = obj.return_until;
    };

    async insert(): Promise<number> {
        //1. Czy autor jest w DB book_authors
        let author_id = await AuthorRecord.findID(this.name_surname);

        if(author_id === null) {
            //- nie -> dodać do DB book_authors i zwrócić id
            const newAuthor = new AuthorRecord({
                name_surname: this.name_surname,
            } as AuthorRecord);

            author_id = await newAuthor.insert();
        }

        //2. Czy title jest w DB book_titles
        let title_id = await TitleRecord.findID(this.title);

        if(title_id === null) {
            //- nie -> dodać do DB book_titles
            const newTitle = new TitleRecord({
                title: this.title,
            } as TitleRecord);

            title_id = await newTitle.insert();
        }

        //3. Znajdź state_id (DB tylko do odczytu)
        let state_id = await BookStateRecord.findID(this.state);

        if(state_id === null) {
            state_id = 1;
        }

        //4. Tych samych książek może być wiele
        //5. dodać do DB books nową książkę użyć id(author) i id(title)

        //id AUTOINCREMENT
        const [results]: any = await pool.execute(
            "INSERT INTO `books`" +
            " VALUES(NULL, :author_id, NULL, NULL, :title_id, :state_id, NULL, NULL)", {
                author_id,
                title_id,
                state_id,
            }
        );

        return results.insertId;
    }

    static async find(id: string): Promise<BookRecord | null> {
        const [results]: any = await pool.execute(
            "SELECT `books`.`id`, `name_surname`, `title`, `book_states`.`name` AS `state`, `user_id`, `return_until`" +
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

    async updateState(state: string, user_id: string = 'NULL'): Promise<void> {
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

    async update(author: string, title: string): Promise<void> {
        if(!this.id) {
            throw new Error('Book has no ID');
        }

        //update autora
        const author_id = await AuthorRecord.findID(this.name_surname);
        const editedAuthor = await AuthorRecord.find(author_id);
        if(author !== editedAuthor.name_surname) {
            await editedAuthor.update(author);
        }

        //update tytułu
        const title_id = await TitleRecord.findID(this.title);
        const editedTitle = await TitleRecord.find(title_id);
        if(title !== editedTitle.title) {
            await editedTitle.update(title);
        }
    };

    static async countAuthor(author_id: number): Promise<number> {
        const [results]: any = await pool.execute(
            "SELECT COUNT(*) " +
            "FROM `books` " +
            "WHERE `author1_id` = :author_id", {
                author_id,
            }
        );

        const result = results[0];

        return result['COUNT(*)'];
    }

    static async countTitle(title_id: number): Promise<number> {
        const [results]: any = await pool.execute(
            "SELECT COUNT(*) " +
            "FROM `books` " +
            "WHERE `title_id` = :title_id", {
                title_id,
            }
        );

        const result = results[0];

        return result['COUNT(*)'];
    }

    async delete(): Promise<void> {
        if(!this.id) {
            throw new Error('Book has no ID');
        }

        const author_id = await AuthorRecord.findID(this.name_surname);
        const title_id = await TitleRecord.findID(this.title);

        const authorInBooks = await BookRecord.countAuthor(author_id);
        const titleInBooks = await BookRecord.countTitle(title_id);

        await pool.execute(
            "DELETE FROM `books` WHERE `id` = :id", {
                id: this.id,
            }
        );

        if(authorInBooks === 1) {
            //delete author if is used only in this book
            const deletedAuthor = await AuthorRecord.find(author_id);
            await deletedAuthor.delete();
        }

        if(titleInBooks === 1) {
            //delete title if is used only in this book
            const deletedTitle = await TitleRecord.find(title_id);
            await deletedTitle.delete();
        }
    };
};