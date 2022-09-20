import express from 'express';
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, 'static')));

app.listen(3000, 'localhost', () => {
    console.log('Tmp-front (test HTML) is working ...');
});