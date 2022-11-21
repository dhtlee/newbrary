import mongoose from 'mongoose';
import path from 'path';

export const COVER_IMAGE_BASE_PATH = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImageName: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  }
});

bookSchema.virtual('coverImagePath').get(function() {
  if (this.coverImageName != null) {
    return path.join('/', COVER_IMAGE_BASE_PATH, this.coverImageName);
  }
});

const bookModel = mongoose.model('Book', bookSchema);

export default bookModel;