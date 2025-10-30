const JobCategoryService = require('../service/JobCategoryService');

exports.getJobCategoryList = async (req, res) => {

    try {
        const result = await JobCategoryService.getJobCategoryList(req.query);

        res.status(200).json({
            status: 200,
            message: 'Job category list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in getJobCategoryList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }

};

// Create Job Category Controller
exports.createJobCategory = async (req, res) => {
    try {
        const { category_name, category_status } = req.body;

        if (!category_name) {
            return res.status(400).json({ status: false, message: 'Category name is required' });
        }

        if (!req.file) {
            return res.status(400).json({ status: false, message: 'Category image is required' });
        }

        const category_image = `/uploads/JobCategoryImages/${req.file.filename}`;

        const result = await JobCategoryService.createJobCategory({
            category_name,
            category_image,
            category_status,
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in createJobCategory Controller:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
