// models/Student.js
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    username: { type: String, unique: true, sparse: true },

    profileCompletion: {
        basic: { type: Boolean, default: false },
        address: { type: Boolean, default: false },
        body: { type: Boolean, default: false },
        parent: { type: Boolean, default: false },
        education: { type: Boolean, default: false },
        documents: { type: Boolean, default: false },
        certifications: { type: Boolean, default: false },
        skills: { type: Boolean, default: false },
        experience: { type: Boolean, default: false },
        preferences: { type: Boolean, default: false },
        bank: { type: Boolean, default: false },
        emergency: { type: Boolean, default: false },
        social: { type: Boolean, default: false }
    },

    // KYC / verification
    otpVerified: { type: Boolean, default: false },
    kycStatus: { type: String, enum: ["not_submitted", "pending", "verified", "rejected"], default: "not_submitted" },

    lastLoginAt: { type: Number },
    lastLoginIP: { type: String },

    accountStatus: { type: String, enum: ["active", "inactive", "blocked"], default: "active" },

    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() }
});

StudentSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Student", StudentSchema);
