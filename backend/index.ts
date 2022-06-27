import express from 'express';
import 'express-async-errors';
import path from "path";
import {config} from "./config/config";

const app = express();

app.use(express.json());
//temporary
app.use(express.static(path.join(__dirname, 'public')));

app.listen(config.listenPort, config.listenHost, () => {
    console.log('Server is working...');
});