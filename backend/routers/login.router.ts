import express, {Request, Response} from "express";
import path from "path";
import {pool} from "../utils/db";
import {session} from "../utils/sessions";

export const loginRouter = express.Router();

loginRouter.get('/', (req: Request, res: Response) => {
    res.sendFile('login.html', {
        root: path.join(__dirname, '../public'),
    });
});

loginRouter.post('/', (req: Request, res: Response) => {
    const {login, password} = req.body;

    //1. pobierz usera wg login z DB (id, login, password)
    (async () => {
        const [results]: any = await pool.execute(
            "SELECT `users`.`id`,`login`,`password`,`name` AS `role` FROM `users`" +
            "JOIN `user_roles` ON `users`.`user_role_id` = `user_roles`.`id`" +
            " WHERE `login` = :login", {
            login: login,
        });

        const user = results[0];

        //2. sprawdź czy hasło się zgadza
        if(user && password === user.password) {
            //3. jeśli OK to utwórz cookie (udostępnij tylko login i id)
            //   i przekieruj na stronę główną

            //tworzymy sesję
            const session_id = session.add(user.role);

            res.cookie('visitor_id', user.id);
            res.cookie('login', login);
            res.cookie('role', user.role);
            res.cookie('session_id', session_id, {
                httpOnly: true,
            });

            res.json({logged: true})
        } else {
            res.json({logged: false});
        }
    })();
});