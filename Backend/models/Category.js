const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  categoryImage: { type: String } , // path to uploaded image
  categorySKU: { type: String},
  categoryStatus: { type: Number, default: 0 }// 0: active, 1: inactive,2: deleted
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
