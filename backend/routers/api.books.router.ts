import express, {Request, Response} from "express";

export const apiBooksRouter = express.Router();

apiBooksRouter.get('/books/:page/:per_page', (req: Request, res: Response) => {
    res.send('lista pierwszych 5 książek (domyślnie)');
});