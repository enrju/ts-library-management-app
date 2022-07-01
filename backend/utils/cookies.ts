import {NextFunction, Request, Response} from "express";
import {session} from "./sessions";

export interface CookiesEntries {
    visitor_id: string;
    login: string;
    role: string;
    session_id: string;
};

export class Cookies {
    static create(res: Response, obj: CookiesEntries) {
        res.cookie('visitor_id', obj.visitor_id);
        res.cookie('login', obj.login);
        res.cookie('role', obj.role);
        res.cookie('session_id', obj.session_id, {
            httpOnly: true,
        });
    };

    static remove(res: Response) {
        res.clearCookie('visitor_id');
        res.clearCookie('login');
        res.clearCookie('role');
        res.clearCookie('session_id');
    };

    static checkSession(req: Request, res: Response, next: NextFunction) {
        const {session_id} = req.cookies;

        if(!session_id && !session.isExist(session_id)) {
            res.redirect('/login');
            return;
        }

        next();
    }
};