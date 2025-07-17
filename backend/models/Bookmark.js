const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  title: String,
  favicon: String,
  summary: String,
  tags: [String],
  order: {
    type: Number,
    default: 0,
    index: true
  },
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.createdAt = ret.createdAt.toISOString();
      ret.updatedAt = ret.updatedAt.toISOString();
      return ret;
    }
  }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema); 