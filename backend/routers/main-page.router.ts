import express, {NextFunction, Request, Response} from "express";
import {checkCookie} from "../utils/check-cookie";

export const mainPageRouter = express.Router();

mainPageRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    checkCookie(req, res, next);
});