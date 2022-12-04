import express from 'express';
import Author from '../models/author';
import Book from '../models/book';

const router = express.Router();

// all authors route - FE
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {
      authors,
      searchOptions: req.query
    });
  } catch {
    res.redirect('/');
  }
});

// new author route - FE
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});

// create author - api
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`)
  } catch {
    res.render('authors/new', {
      author,
      errorMessage: 'Error creating Author'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(5).exec();
    res.render('authors/show', {
      author,
      booksByAuthor: books
    })
  } catch {
    res.redirect('/');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render('authors/edit', { author });
  } catch {
    res.redirect('/authors');
  }
});

router.put('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`)
  } catch {
    if (author == null) {
      res.redirect('/');
    } else {
      res.render('authors/edit', {
        author,
        errorMessage: 'Error updating Author'
      });
    }
  }
});

router.delete('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect('/authors')
  } catch {
    if (author == null) {
      res.redirect('/');
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
});

export default router;