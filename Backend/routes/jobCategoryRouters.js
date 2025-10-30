const express = require('express');
const router = express.Router();
const upload = require('../middleware/JobCategoryUploadMidd');
const JobCategoryController = require('../controllers/JobCategoryController');

router.get('/get_job_category_list', JobCategoryController.getJobCategoryList);
router.post('/create_job_category', upload('Category').single('category_image'), JobCategoryController.createJobCategory);
router.put('/update_job_category/:id', upload('Category').single('category_image'), JobCategoryController.updateJobCategory);

router.get('/get_job_subcategory_list', JobCategoryController.getJobSubCategoryList);
router.post('/create_job_subcategory', upload('SubCategory').single('subcategory_image'), JobCategoryController.createJobSubCategory);
router.put('/update_job_subcategory/:id', upload('SubCategory').single('subcategory_image'), JobCategoryController.updateJobSubCategory);

module.exports = router;
