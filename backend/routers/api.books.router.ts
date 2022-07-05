import express, {Request, Response} from "express";
import {Cookies} from "../utils/cookies";
import {createdSessions} from "../utils/sessions";
import {BookRecord} from "../records/book.record";

export const apiBooksRouter = express.Router();

apiBooksRouter.get('/books', (req: Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    let userRole = createdSessions.getRole(session_id);

    if(userRole) {

        (async () => {
            const allBooks = await BookRecord.findAll();

            res.json(allBooks);
        })();

    } else {
        res.json({access: false});
    }
});

apiBooksRouter.get('/books/:page/:per_page', (req: Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    let userRole = createdSessions.getRole(session_id);

    if(userRole) {

        res.redirect('/api/books');

    } else {
        res.json({access: false});
    }
});