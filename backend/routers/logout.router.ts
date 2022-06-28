import express, {Request, Response} from "express";

export const logoutRouter = express.Router();

logoutRouter.post('/', (req: Request, res: Response) => {
    res.send("<h1>Wylogowanie</h1>");
});