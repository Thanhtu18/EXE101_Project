const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String },
  author: { type: String, required: true },
  authorAvatar: { type: String },
  date: { type: String },
  image: { type: String },
  category: { type: String, required: true },
  readTime: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', BlogSchema);
