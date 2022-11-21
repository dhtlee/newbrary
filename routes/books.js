import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import Author from '../models/author';
import Book, { COVER_IMAGE_BASE_PATH } from '../models/book';

const uploadPath = path.join('public', COVER_IMAGE_BASE_PATH);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
});

const router = express.Router();

// all books route - FE
router.get('/', async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title !== '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
    query = query.gte('publishDate', req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render('books/index', {
      books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/');
  }
});

// new book route - FE
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book());
});

// create book - api
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description
  });

  try {
    const newBook = await book.save();
    // res.redirect(`/books/${newBook.id}`);
    res.redirect('/books');
  } catch {
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }
    renderNewPage(res, book, true);
  }
});

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) {
      console.error(err);
    }
  });
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors,
      book
    };
    if (hasError) {
      params.errorMessage = 'Error Creating Book';
    }
    res.render('books/new', params);
  } catch {
    res.redirect('/books');
  }
}

export default router;