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

        if (studentData.studentReferralByCode) {
            const studentReferralCodeExists = await studentModel.findOne({
                studentReferralCode: studentData.studentReferralByCode
            });

            if (!studentReferralCodeExists) {
                return { status: 400, message: 'Invalid referral code provided' };
            }

            studentData.studentReferralById = studentReferralCodeExists._id;
            studentData.studentReferralByCode = studentReferralCodeExists.studentReferralCode;
        }

        const generateRandomReferralCode = async () => {
            const prefix = "CW"; // CW = CareerWave
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let code = prefix;

            for (let i = 0; i < 6; i++) {
                code += characters[Math.floor(Math.random() * characters.length)];
            }

            const exists = await studentModel.findOne({ studentReferralCode: code });
            if (exists) {
                return await generateRandomReferralCode();
            }

            return code;
        };

        const newStudent = new studentModel({
            studentProfilePic: studentData.studentProfilePic,
            studentFirstName: studentData.studentFirstName,
            studentLastName: studentData.studentLastName,
            studentEmail: studentData.studentEmail,
            studentMobileNo: studentData.studentMobileNo,
            studentPassword: studentData.studentPassword,
            studentJobType: studentData.studentJobType,
            studentReferralCode: await generateRandomReferralCode(),
            studentReferralById: studentData.studentReferralById || null,
            studentReferralByCode: studentData.studentReferralByCode || null
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
                studentReferralCode: newStudent.studentReferralCode
            }
        };

    } catch (error) {
        console.error('Error in studentRegistration:', error);
        return { status: 500, message: 'An error occurred during student registration' };
    }
};

// Student Login Service
exports.studentLogin = async (studentLoginData) => {
    try {

        const student = await studentModel.findOne({
            $or: [
                { studentEmail: studentLoginData.studentEmailOrMobile },
                { studentMobileNo: studentLoginData.studentEmailOrMobile }
            ]
        });

        if (!student) {
            return {
                status: 404,
                message: 'Student not found with the provided email or mobile number'
            };
        }


        if (student.studentPassword !== studentLoginData.studentPassword) {
            return {
                status: 401,
                message: 'Incorrect password'
            };
        }

        return {
            status: 200,
            message: 'Student logged in successfully',
            jsonData: {
                studentId: student._id,
                studentFirstName: student.studentFirstName,
                studentLastName: student.studentLastName,
                studentEmail: student.studentEmail,
                studentMobileNo: student.studentMobileNo,
                studentJobType: student.studentJobType,
                studentProfilePic: student.studentProfilePic
            }
        };

    } catch (error) {
        console.error("Login Error:", error);
        return {
            status: 500,
            message: 'An error occurred during student login',
            error: error.message
        };
    }
};