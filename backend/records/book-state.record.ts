import {pool} from "../utils/db";

export class BookStateRecord {
    id?: number;
    title: string;

    // constructor(obj: BookStateRecord) {
    //     if(obj.id) this.id = obj.id;
    //
    //     this.title = obj.title;
    // }

    static async findID(state: string): Promise<number | null> {
        const [results]: any = await pool.execute(
            "SELECT * FROM `book_states` WHERE `name` = :state", {
                state,
            }
        );

        return results.length > 0 ? results[0].id : null;
    }
}