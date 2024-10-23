import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import { signinSchema, signupSchema } from "../validations/user.js";
import {
  generateRefreshToken,
  generateTokenAndSetCookie,
} from "../utils/token.js";
import jwt from "jsonwebtoken";
import { json } from "express";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        message: "Email đã tồn tại !",
      });
    }
    const hashPass = await bcryptjs.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashPass });
    return res.status(StatusCodes.CREATED).json({ user });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const signin = async (req, res) => {
  try {
    const { error } = signinSchema.validate(req.body);
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        message: "Email không tồn tại !",
      });
    }
    const isMatch = bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        message: "Sai mật khẩu !",
      });
    }

    const accessToken = generateTokenAndSetCookie(user._id, res);
    const refreshToken = generateRefreshToken(user._id, res);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(StatusCodes.ACCEPTED).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const update = async (req, res) => {
  try {
    const { password, ...updateFields } = req.body;

    if (password) {
      const hashPass = await bcryptjs.hash(password, 10);
      updateFields.password = hashPass;
    }

    const data = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Người dùng không tồn tại !" });
    }
    return res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    if (!users) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không có người dùng nào !" });
    }

    return res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Người dùng không tồn tại !" });
    }

    return res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Người dùng không tồn tại !" });
    }
    return res.status(StatusCodes.OK).json({ message: "Xóa thành công !" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Invalid Refresh Token" });

    const user = await User.findOne({ refreshToken });

    if (!user)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "User not found" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY,
      (err, userData) => {
        if (err)
          return res.sendStatus(
            StatusCodes.FORBIDDEN,
            json({ message: "ERROR" })
          );

        const newAccessToken = generateTokenAndSetCookie(user._id, res);

        return res
          .status(StatusCodes.OK)
          .json({ accessToken: newAccessToken, refreshToken });
      }
    );
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "ERROR" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid Refresh Token" });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "User not found" });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(StatusCodes.OK).json({ message: "Logout successful" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred during logout" });
  }
};
