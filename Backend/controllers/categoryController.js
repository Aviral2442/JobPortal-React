const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Category = require('../models/Category');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --------------------------------------------------------
// POST /api/categories - Add new category
// --------------------------------------------------------
router.post('/', upload.single('categoryImage'), async (req, res) => {
  const { categoryName, categorySKU, categoryStatus } = req.body;

  if (!categoryName) return res.status(400).json({ message: 'Category name is required' });

  try {
    const category = new Category({
      categoryName,
      categorySKU: categorySKU || '',
      categoryStatus: categoryStatus ? Number(categoryStatus) : 0,
      categoryImage: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------------------------------------------
// GET /api/categories - Get all categories with search, filter, sort & pagination
// --------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const {
      search,
      status,
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};
    if (search) query.categoryName = { $regex: search, $options: 'i' };
    if (status !== undefined) query.categoryStatus = Number(status);

    const skip = (page - 1) * limit;

    const categories = await Category.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Category.countDocuments(query);

    res.json({
      data: categories,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------------------------------------------
// GET /api/categories/:id - Get a single category by ID
// --------------------------------------------------------
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------------------------------------------
// PUT /api/categories/:id - Update existing category
// --------------------------------------------------------
router.put('/:id', upload.single('categoryImage'), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  const { categoryName, categorySKU, categoryStatus } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (categoryName) category.categoryName = categoryName;
    if (categorySKU !== undefined) category.categorySKU = categorySKU;
    if (categoryStatus !== undefined) category.categoryStatus = Number(categoryStatus);
    if (req.file) category.categoryImage = `/uploads/${req.file.filename}`;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------------------------------------------
// DELETE /api/categories/:id - Delete category
// --------------------------------------------------------
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
