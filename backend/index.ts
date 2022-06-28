import express from 'express';
import 'express-async-errors';
import path from "path";
import {config} from "./config/config";
import {pool} from "./utils/db";

const app = express();

app.use(express.json());
//temporary front-end
app.use(express.static(path.join(__dirname, 'public')));

//test db-connection
(async () => {
    const [results] = await pool.execute("SELECT * FROM `users`");
    console.log(results);
})();

app.listen(config.listenPort, config.listenHost, () => {
    console.log('Server is working...');
});