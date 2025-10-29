const JobCategoryModel = require('../models/JobCategoryModel');

// Job Category Service
exports.createJobCategory = async (data) => {
    try {
        const existingCheckName = await JobCategoryModel.findOne({ category_name: data.category_name });

        if (existingCheckName) {
            return { status: false, message: 'Category name already exists' };
        }

        const category_slug = data.category_name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        const newCategory = new JobCategoryModel({
            category_name: data.category_name,
            category_image: data.category_image,
            category_slug,
            category_status: data.category_status || 0,
        });

        await newCategory.save();

        return {
            status: 200,
            message: 'Job category created successfully',
            jsonData: newCategory,
        };
    } catch (error) {
        console.error('Error in createJobCategory Service:', error);
        throw error;
    }
};
