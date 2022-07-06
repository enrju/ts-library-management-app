import express, {NextFunction, Request, Response} from "express";
import {Cookies} from "../utils/cookies";
import {createdSessions} from "../utils/sessions";
import {BookRecord} from "../records/book.record";

export const apiUsersRouter = express.Router();

apiUsersRouter.get('/users/:id/books', (req: Request, res: Response, next: NextFunction) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    if(userRole) {

        (async () => {
            const user_id = req.params.id;

            const userBooks = await BookRecord.findForUser(user_id);

            res.json(userBooks);
        })();

    } else {
        res.json({access: false});
    }
});