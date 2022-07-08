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

apiBooksRouter.post('/books', (req: Request, res: Response) => {
    const session_id = Cookies.getSessionId(req);

    const userRole = createdSessions.getRole(session_id);

    if(userRole === 'admin') {
        console.log(req.body);
        const author: string = req.body.author;
        const title: string = req.body.title;

        (async () => {
            const newBook = new BookRecord({
                name_surname: author,
                title: title,
                state: 'available',
            });

            const book_id = await newBook.insert();

            console.log(book_id);

        })();



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