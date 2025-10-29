const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  subCategoryName: { type: String, required: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategoryImage: { type: String }, // store path or URL
 
},{ timestamps: true });

module.exports= mongoose.model('SubCategory', SubCategorySchema);
