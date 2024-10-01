import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "employee",
    },
  },
  { timestamps: true, versionKey: false }
);
const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
