import express, {NextFunction, Request, Response} from "express";

export const checkCookie = (req: Request, res: Response, next: NextFunction) => {
    const {visitor_logged} = req.cookies;

    if(!visitor_logged) {
        res.redirect('/login');
        return;
    }

    next();
}