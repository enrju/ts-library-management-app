import express, {NextFunction, Request, Response} from "express";
import {Cookies} from "../utils/cookies";
import {createdSessions} from "../utils/sessions";
import {BookRecord} from "../records/book.record";
import {UserRecord} from "../records/user.record";

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

apiUsersRouter.get('/users/login/:login', (req: Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    if(userRole === 'admin') {

        (async () => {
            const user_login = req.params.login;

            const user = await UserRecord.find(user_login);

            if(user) {
                res.json({user_id: user.id});
            } else {
                res.json(null);
            }

        })();

    } else {
        res.json({access: false});
    }
});