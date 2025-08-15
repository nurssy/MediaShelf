const mongoose = require('mongoose');

const mediaItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: null },
  addedDate: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [mediaItemSchema]
});

module.exports = mongoose.model('Category', categorySchema);
