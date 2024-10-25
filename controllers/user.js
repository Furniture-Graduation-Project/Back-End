import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { signupSchema, signinSchema } from "../validations/user.js";
import dotenv from "dotenv";
import generateTokenAndSetCookie from "../utils/generateToken.js";
dotenv.config();

const UserController = {
  signup: async (req, res) => {
    try {
      const { value, error } = signupSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const message = error.details.map((e) => e.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ message });
      }
      const isExist = await User.findOne({ email: value.email });
      if (isExist) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Email đã tồn tại!",
        });
      }
      const hashPass = await bcrypt.hash(value.password, 10);
      const user = await User.create({ ...value, password: hashPass });
      return res.status(StatusCodes.CREATED).json({ user });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  signin: async (req, res) => {
    try {
      const { value, error } = signinSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const message = error.details.map((e) => e.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ message });
      }
      const user = await User.findOne({ email: value.email });
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Email không tồn tại!",
        });
      }
      const isMatch = await bcrypt.compare(value.password, user.password);
      if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Sai mật khẩu!",
        });
      }
      generateTokenAndSetCookie(user._id, res);
      return res.status(StatusCodes.OK).json({ user });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Không tìm thấy người dùng" });
      }
      const { value, error } = signinSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const message = error.details.map((e) => e.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ message });
      }
      if (value.password) {
        const hashPass = await bcrypt.hash(value.password, 10);
        value.password = hashPass;
      }

      const data = await User.findByIdAndUpdate(id, value, {
        new: true,
        runValidators: true,
      });

      if (!data) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Người dùng không tồn tại!" });
      }
      return res.status(StatusCodes.OK).json({ data });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
};

export default UserController;
