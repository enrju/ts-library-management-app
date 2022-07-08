import {pool} from "../utils/db";

export class TitleRecord {
    id?: number;
    title: string;

    constructor(obj: TitleRecord) {
        if(obj.id) this.id = obj.id;

        this.title = obj.title;
    }

    static async findID(title: string): Promise<number | null> {
        const [results]: any = await pool.execute(
            "SELECT * FROM `book_titles` WHERE `title` = :title", {
                title,
            }
        );

        return results.length > 0 ? new TitleRecord(results[0]).id : null;
    }

    async insert(): Promise<number> {
        //id AUTOINCREMENT
        const [results]: any = await pool.execute(
            "INSERT INTO `book_titles` VALUES(NULL, :title)", {
                title: this.title,
            }
        );

        return results.insertId;
    }
}