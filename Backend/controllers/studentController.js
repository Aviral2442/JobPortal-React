const studentService = require("../service/studentService");

// Student Registration Controller
exports.studentRegistration = async (req, res) => {
    try {
        const studentProfilePic = req.file ? `/uploads/StudentProfile/${req.file.filename}` : null;
        const result = await studentService.studentRegistration({ ...req.body, studentProfilePic: studentProfilePic });
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};

// Student Login Controller
exports.studentLogin = async (req, res) => {
    try {
        const result = await studentService.studentLogin(req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};