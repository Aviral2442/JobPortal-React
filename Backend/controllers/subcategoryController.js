const SubCategory = require('../models/SubCategory'); 
import fs from 'fs';
import path from 'path';

// @desc    Add new sub-category
// @route   POST /api/subcategories
// @access  Admin
export const addSubCategory = async (req, res) => {
  try {
    const { subCategoryName, parentCategory } = req.body;

    if (!subCategoryName || !parentCategory) {
      return res.status(400).json({ message: 'Name and parent category are required' });
    }

    let subCategoryImage = null;
    if (req.file) {
      subCategoryImage = `/uploads/subcategories/${req.file.filename}`;
    }

    const newSubCategory = new SubCategory({
      subCategoryName,
      parentCategory,
      subCategoryImage,
    });

    const saved = await newSubCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all sub-categories
// @route   GET /api/subcategories
// @access  Admin
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate('parentCategory', 'categoryName')
      .sort({ createdAt: -1 });
    res.json(subCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update sub-category
// @route   PUT /api/subcategories/:id
// @access  Admin
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { subCategoryName, parentCategory } = req.body;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) return res.status(404).json({ message: 'Sub-category not found' });

    subCategory.subCategoryName = subCategoryName || subCategory.subCategoryName;
    subCategory.parentCategory = parentCategory || subCategory.parentCategory;

    if (req.file) {
      // delete old image if exists
      if (subCategory.subCategoryImage) {
        const oldImagePath = path.join(process.cwd(), 'public', subCategory.subCategoryImage);
        fs.existsSync(oldImagePath) && fs.unlinkSync(oldImagePath);
      }
      subCategory.subCategoryImage = `/uploads/subcategories/${req.file.filename}`;
    }

    const updated = await subCategory.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete sub-category
// @route   DELETE /api/subcategories/:id
// @access  Admin
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) return res.status(404).json({ message: 'Sub-category not found' });

    // delete image if exists
    if (subCategory.subCategoryImage) {
      const imagePath = path.join(process.cwd(), 'public', subCategory.subCategoryImage);
      fs.existsSync(imagePath) && fs.unlinkSync(imagePath);
    }

    await subCategory.deleteOne();
    res.json({ message: 'Sub-category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
