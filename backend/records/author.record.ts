import {pool} from "../utils/db";

export class AuthorRecord {
    id?: number;
    name_surname: string;

    constructor(obj: AuthorRecord) {
        if(obj.id) this.id = obj.id;

        this.name_surname = obj.name_surname;
    }

    static async findID(name_surname: string): Promise<number | null> {
        const [results]: any = await pool.execute(
            "SELECT * FROM `book_authors` WHERE `name_surname` = :name_surname", {
                name_surname,
            }
        );

        return results.length > 0 ? new AuthorRecord(results[0]).id : null;
    }

    static async find(id: number): Promise<AuthorRecord | null> {
        const [results]: any = await pool.execute(
            "SELECT * FROM `book_authors` WHERE `id` = :id", {
                id,
            }
        );

        return results.length > 0 ? new AuthorRecord(results[0]) : null;
    }

    async insert(): Promise<number> {
        //id AUTOINCREMENT
        const [results]: any = await pool.execute(
            "INSERT INTO `book_authors` VALUES(NULL, :name_surname)", {
                name_surname: this.name_surname,
            }
        );

        return results.insertId;
    }

    async update(author: string): Promise<void> {
        await pool.execute(
            "UPDATE `book_authors` SET " +
            "`name_surname` = :name_surname " +
            "WHERE `id` = :id", {
                name_surname: author,
                id: this.id,
            }
        );
    }

    async delete(): Promise<void> {
        if(!this.id) {
            throw new Error('Author has no ID');
        }

        await pool.execute(
            "DELETE FROM `book_authors` WHERE `id` = :id", {
                id: this.id,
            }
        );
    }
}