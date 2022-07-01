import {Response} from "express";

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
};