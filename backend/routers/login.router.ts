import express, {Request, Response} from "express";

export const loginRouter = express.Router();

loginRouter.get('/', (req: Request, res: Response) => {
    res.send("<h1>Logowanie</h1>");
});

loginRouter.post('/', (req: Request, res: Response) => {
    res.send("<h1>Wysłano dane logowania</h1>");
});