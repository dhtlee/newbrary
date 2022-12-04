import mongoose from 'mongoose';

import Book from './book';

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

authorSchema.pre('remove', function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error('Cannot delete this author since there are books associated to this author'));
    } else {
      next();
    }
  });
});

const authorModel = mongoose.model('Author', authorSchema);

export default authorModel;