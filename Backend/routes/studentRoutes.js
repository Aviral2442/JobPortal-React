const express = require('express');
const router = express.Router();
const upload = require('../middleware/JobCategoryUploadMidd');
const studentController = require('../controllers/studentController');

router.post('/student_registration', upload('StudentProfile').single('studentProfilePic'), studentController.studentRegistration);

module.exports = router;
