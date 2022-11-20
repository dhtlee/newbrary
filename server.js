import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import indexRouter from './routes/index';
import authorRouter from './routes/authors';

import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'prod') {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)

app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to Mongoose!');
  })
  .catch(error => {
    console.log(error)
  });

app.use(function (req, res, next) {
  res.locals.title = 'Newbrary';
  next();
});

app.use('/', indexRouter);
app.use('/authors', authorRouter);

app.listen(process.env.PORT || 3000);