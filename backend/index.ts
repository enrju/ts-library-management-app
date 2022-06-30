import express from 'express';
import 'express-async-errors';
import cookieParser from "cookie-parser";
import path from "path";
import {config} from "./config/config";
import {pool} from "./utils/db";
import {loginRouter} from "./routers/login.router";
import {logoutRouter} from "./routers/logout.router";
import {apiUsersRouter} from "./routers/api.users.router";
import {apiBooksRouter} from "./routers/api.books.router";
import {mainPageRouter} from "./routers/main-page.router";

const app = express();

app.use(cookieParser());
app.use(express.json());

//routing
app.use('/', mainPageRouter);   //check cookie

//temporary front-end
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/api', apiUsersRouter);
app.use('/api', apiBooksRouter);

//test db-connection
(async () => {
    const [results] = await pool.execute("SELECT * FROM `users`");
    console.log(results);
})();

app.listen(config.listenPort, config.listenHost, () => {
    console.log('Server is working...');
});