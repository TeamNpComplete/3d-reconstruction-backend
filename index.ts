import express, { Application, Request, Response } from "express";
import path from "path";
import dotenv from 'dotenv';

dotenv.config()
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/api', require('./controllers'));

app.listen(3000, () => {
    console.log('Listening on port 3000 ...');
})