// models/StudentBasicInfo.js
const mongoose = require("mongoose");

const StudentBasicInfoSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  fullName: { type: String },

  dateOfBirth: { type: Number }, // unix ms
  gender: { type: String, enum: ["male","female","other","prefer_not_to_say"], default: "prefer_not_to_say" },

  mobileNumber: { type: String },
  alternateMobileNumber: { type: String },
  email: { type: String },

  profilePhotoUrl: { type: String },

  maritalStatus: { type: String, enum: ["single","married","other","prefer_not_to_say"], default: "single" },

  motherTongue: { type: String },
  nationality: { type: String },
  citizenship: { type: String },

  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() }
});

StudentBasicInfoSchema.pre("save", function(next){
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("StudentBasicInfo", StudentBasicInfoSchema);
