import {NextFunction, Request, Response} from "express";
import {session} from "./sessions";

export const checkCookie = (req: Request, res: Response, next: NextFunction) => {
    const {session_id} = req.cookies;

    if(!session_id && !session.isExist(session_id)) {
        res.redirect('/login');
        return;
    }

    next();
}