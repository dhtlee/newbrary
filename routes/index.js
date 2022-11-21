import express from 'express';
import Book from '../models/book';

const router = express.Router();

router.get('/', async (req, res) => {
  let books = [];
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
    res.render('index', { books });
  } catch {
    books = [];
  }
});

export default router;