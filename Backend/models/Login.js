const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  role: { type: String, enum: ["admin", "user"], default: "user" },
  remember: { type: Boolean, default: false }
});

module.exports = mongoose.model("Login", loginSchema);
