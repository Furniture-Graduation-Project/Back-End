import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    fullname: {
      type: String,
    },
    phonenumber: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);
const Employee = mongoose.model("employee", EmployeeSchema);
export default Employee;
