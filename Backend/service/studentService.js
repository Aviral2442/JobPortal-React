const studentModel = require('../models/studentModel');

// Student Registration Service
exports.studentRegistration = async (studentData) => {
    try {
        const emailExists = await studentModel.findOne({ studentEmail: studentData.studentEmail });
        if (emailExists) {
            return { status: 409, message: 'Student Entered Email is already registered' };
        }

        const mobileExists = await studentModel.findOne({ studentMobileNo: studentData.studentMobileNo });
        if (mobileExists) {
            return { status: 409, message: 'Student Entered Mobile No. is already registered' };
        }

        const newStudent = new studentModel({
            studentProfilePic: studentData.studentProfilePic,
            studentFirstName: studentData.studentFirstName,
            studentLastName: studentData.studentLastName,
            studentEmail: studentData.studentEmail,
            studentMobileNo: studentData.studentMobileNo,
            studentPassword: studentData.studentPassword,
            studentJobType: studentData.studentJobType
        });

        await newStudent.save();

        return {
            status: 200,
            message: 'Student registered successfully',
            jsonData: {
                studentId: newStudent._id,
                studentFirstName: newStudent.studentFirstName,
                studentLastName: newStudent.studentLastName,
                studentEmail: newStudent.studentEmail,
                studentMobileNo: newStudent.studentMobileNo,
                studentJobType: newStudent.studentJobType,
            }
        };
    } catch (error) {
        console.error('Error in studentRegistration:', error);
        return { status: 500, message: 'An error occurred during student registration' };
    }
};