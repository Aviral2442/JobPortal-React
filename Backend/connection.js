// connection.js
const mongoose = require("mongoose");
require("dotenv").config();

 const url = process.env.MONGOOSE_DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
