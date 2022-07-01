import express, {NextFunction, Request, Response} from "express";
import {Cookies} from "../utils/cookies";

export const mainPageRouter = express.Router();

mainPageRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    Cookies.checkSession(req, res, next);
});