import express, {Request, Response} from "express";
import path from "path";
import {createdSessions} from "../utils/sessions";
import {UserRecord} from "../records/user.record";
import {Cookies} from "../utils/cookies";

export const loginRouter = express.Router();

loginRouter.get('/', (req: Request, res: Response) => {
    res.sendFile('login.html', {
        root: path.join(__dirname, '../public'),
    });
});

loginRouter.post('/', (req: Request, res: Response) => {
    const {login, password} = req.body;

    (async () => {
        const user = await UserRecord.find(login);

        if(user && password === user.password) {
            const session_id = createdSessions.add(user.role);

            Cookies.create(res, {
                visitor_id: user.id,
                login: login,
                role: user.role,
                session_id: session_id,
            });

            res.json({logged: true})
        } else {
            res.json({logged: false});
        }
    })();
});