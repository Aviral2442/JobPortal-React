const express = require('express');
const router = express.Router();
const upload = require('../middleware/JobCategoryUploadMidd');
const JobCategoryController = require('../controllers/JobCategoryController');

router.get('/get_job_category_list', JobCategoryController.getJobCategoryList);
router.post('/create_job_category', upload.single('category_image'), JobCategoryController.createJobCategory);

module.exports = router;
