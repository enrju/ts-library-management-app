import express, {Request, Response} from "express";
import {Cookies} from "../utils/cookies";
import {createdSessions} from "../utils/sessions";
import {BookRecord} from "../records/book.record";

export const apiBooksRouter = express.Router();

apiBooksRouter.get('/books', (req: Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    if(userRole) {

        (async () => {
            const allBooks = await BookRecord.findAll();

            res.json(allBooks);
        })();

    } else {
        res.json({access: false});
    }
});

apiBooksRouter.get('/books/:id', (req: Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    const book_id = req.params.id;

    if(userRole === 'admin') {
        (async () => {
            const oneBook = await BookRecord.find(book_id);

            res.json(oneBook);
        })();
    } else {
        res.json({access: false});
    }
});

apiBooksRouter.get('/books/:page/:per_page', (req: Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    if(userRole) {

        res.redirect('/api/books');

    } else {
        res.json({access: false});
    }
});

apiBooksRouter.post('/books', (req: Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    if(userRole === 'admin') {
        const author: string = req.body.author;
        const title: string = req.body.title;

        (async () => {
            const newBook = new BookRecord({
                name_surname: author,
                title: title,
                state: 'available',
            });

            const book_id = await newBook.insert();

            res.json({insertedId: book_id});
        })();
    } else {
        res.json({access: false});
    }
});

apiBooksRouter.patch('/books/:id', (req:Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    if(userRole === 'admin') {
        const id = req.params.id;
        const author: string = req.body.author;
        const title: string = req.body.title;

        (async () => {
            const book = await BookRecord.find(id);

            await book.update(author, title);

            res.json({updated: true});
        })();
    } else {
        res.json({access: false});
    }
});

apiBooksRouter.patch('/books/:id/state/:activity', (req: Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    const id = req.params.id;
    const activity = req.params.activity;


    switch(userRole) {
        case 'user':
            switch(activity) {
                case 'cancel':

                    (async () => {
                        const book = await BookRecord.find(id);

                        await book.updateState('available');

                        res.json({updated: true});
                    })();

                    break;
                case 'reserve':

                    (async () => {
                        const book = await BookRecord.find(id);

                        await book.updateState('reserved', req.cookies.visitor_id);

                        res.json({updated: true});
                    })();

                    break;
                default:
                    res.json({access: false});
            }
            break;
        case 'admin':
            switch(activity) {
                case 'cancel':

                    (async () => {
                        const book = await BookRecord.find(id);

                        await book.updateState('available');

                        res.json({updated: true});
                    })();

                    break;
                case 'rent':

                    (async () => {
                        const book = await BookRecord.find(id);

                        await book.updateState('rented', book.user_id);

                        res.json({updated: true});
                    })();

                    break;
                default:
                    res.json({access: false});
            }
            break;
        default:
            res.json({access: false});
    }
});

apiBooksRouter.delete('/books/:id', (req:Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    if(userRole === 'admin') {
        const id = req.params.id;

        (async () => {
            const book = await BookRecord.find(id);

            await book.delete();

            res.json({deleted: true});
        })();

    } else {
        res.json({access: false});
    }
});