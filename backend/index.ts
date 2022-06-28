import express from 'express';
import 'express-async-errors';
import path from "path";
import {config} from "./config/config";
import {pool} from "./utils/db";
import {loginRouter} from "./routers/login.router";
import {logoutRouter} from "./routers/logout.router";
import {apiUsersRouter} from "./routers/api.users.router";

const app = express();

app.use(express.json());

//temporary front-end
app.use(express.static(path.join(__dirname, 'public')));

//routing
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/api', apiUsersRouter);

//test db-connection
(async () => {
    const [results] = await pool.execute("SELECT * FROM `users`");
    console.log(results);
})();

app.listen(config.listenPort, config.listenHost, () => {
    console.log('Server is working...');
});