import express, {Request, Response} from "express";
import {session} from "../utils/sessions";

export const logoutRouter = express.Router();

logoutRouter.post('/', (req: Request, res: Response) => {
    const {session_id} = req.cookies;

    session.remove(session_id);

    res.clearCookie('visitor_id');
    res.clearCookie('login');
    res.clearCookie('role');
    res.clearCookie('session_id');
    
    res.send("Wylogowano");
});