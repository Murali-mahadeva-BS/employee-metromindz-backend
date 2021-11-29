const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeModel = Schema(
  {
    username: { type: String, trim: true, required: true, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    phone: { type: String, trim: true, required: true, unique: true },
    gender: {
      type: String,
      required: true,
      trim: true,
      enum: ["Male", "Female", "Others"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeModel);
