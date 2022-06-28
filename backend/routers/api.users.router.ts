import express, {Request, Response} from "express";

export const apiUsersRouter = express.Router();

apiUsersRouter.get('/users/:id/books', (req: Request, res: Response) => {
    res.send('Lista książek wypożyczonych przez usera');
});