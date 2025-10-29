const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SubCategory = require('../models/SubCategory');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads/subcategories');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Add new sub-category
router.post('/', upload.single('subCategoryImage'), async (req, res) => {
  const { subCategoryName, parentCategory } = req.body;

  if (!subCategoryName || !parentCategory)
    return res.status(400).json({ message: 'Sub-category name and parent category are required' });

  try {
    const subCategory = new SubCategory({
      subCategoryName,
      parentCategory,
      subCategoryImage: req.file ? `/uploads/subcategories/${req.file.filename}` : '',
    });

    const savedSubCategory = await subCategory.save();
    res.status(201).json(savedSubCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all sub-categories
router.get('/', async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('parentCategory', 'categoryName');
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **Get single sub-category by ID**
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const subCategory = await SubCategory.findById(id).populate('parentCategory', 'categoryName');
    if (!subCategory) return res.status(404).json({ message: 'Sub-category not found' });
    res.json(subCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update sub-category
router.put('/:id', upload.single('subCategoryImage'), async (req, res) => {
  const { id } = req.params;
  const { subCategoryName, parentCategory } = req.body;

  try {
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) return res.status(404).json({ message: 'Sub-category not found' });

    if (subCategoryName) subCategory.subCategoryName = subCategoryName;
    if (parentCategory) subCategory.parentCategory = parentCategory;
    if (req.file) subCategory.subCategoryImage = `/uploads/subcategories/${req.file.filename}`;

    const updatedSubCategory = await subCategory.save();
    res.json(updatedSubCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete sub-category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) return res.status(404).json({ message: 'Sub-category not found' });

    await subCategory.deleteOne();
    res.json({ message: 'Sub-category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
