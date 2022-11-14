import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import indexRoutes from './routes/index';

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

console.log('before mongoose connection', process.env.DATABASE_URL);
const db = mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to Mongoose!');
  })
  .catch(error => {
    console.log(error)
  });

app.use('/', indexRoutes);

app.listen(process.env.PORT || 3000);