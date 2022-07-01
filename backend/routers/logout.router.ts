import express, {Request, Response} from "express";
import {session} from "../utils/sessions";
import {Cookies} from "../utils/cookies";

export const logoutRouter = express.Router();

logoutRouter.post('/', (req: Request, res: Response) => {
    const {session_id} = req.cookies;

    session.remove(session_id);
    Cookies.remove(res);
    
    res.send("Wylogowano");
});