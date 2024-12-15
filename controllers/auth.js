import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import { signinSchema, signupSchema } from "../validations/user.js";
import {
  clearCookies,
  generateRefreshToken,
  generateTokenAndSetCookie,
} from "../utils/token.js";
import jwt from "jsonwebtoken";
import { io } from "../services/socket.js";

const AuthController = {
  signup: async (req, res) => {
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
  },

  signin: async (req, res) => {
    try {
      const { value, error } = signinSchema.validate(req.body);
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

      const isMatch = await bcryptjs.compare(value.password, user.password);
      if (!isMatch) {
        return res.status(StatusCodes.BAD_GATEWAY).json({
          message: "Sai mật khẩu !",
        });
      }

      const accessToken = generateTokenAndSetCookie(user._id, res);
      const refreshToken = generateRefreshToken(user._id, res);

      user.refreshToken = refreshToken;
      if (user.active === false) {
        const key = String(user._id + "lock");
        io.emit(key, {
          message: "Tài khoản đã bị khóa !",
        });
      }
      await user.save();
      return res.status(StatusCodes.ACCEPTED).json({ accessToken });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { password, ...updateFields } = req.body;

      if (password) {
        const hashPass = await bcryptjs.hash(password, 10);
        updateFields.password = hashPass;
      }
      console.log(req.body);

      const data = await User.findByIdAndUpdate(req.params.id, updateFields, {
        new: true,
        runValidators: true,
      });
      if (!data) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Người dùng không tồn tại !" });
      }
      if (data.active === false) {
        const key = String(data._id + "lock");
        io.emit(key, {
          message: "Tài khoản đã bị khóa !",
        });
      }
      return res.status(StatusCodes.OK).json({ data });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
  refreshToken: async (req, res) => {
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
          .json({ message: "Không tìm thấy tài khoản tuana" });

      jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err) => {
        if (err)
          return res.sendStatus(
            StatusCodes.FORBIDDEN,
            json({ message: "ERROR" })
          );
        const newAccessToken = generateTokenAndSetCookie(user._id, res);
        return res.status(StatusCodes.OK).json({ token: newAccessToken });
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "ERROR" });
    }
  },
  generateToken(user) {
    if (!user || !user.id) {
      throw new Error("User information is required to generate token");
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const secretKey = process.env.JWT_SECRET || "your-secret-key";

    const options = {
      expiresIn: "1h",
    };

    return jwt.sign(payload, secretKey);
  },
  logout: async (req, res) => {
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
      clearCookies(res);
      req.session.destroy();
      return res.status(StatusCodes.OK).json({ message: "Logout successful" });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred during logout" });
    }
  },
  signinGoogle: async (req, res) => {
    try {
      const accessToken = generateTokenAndSetCookie(req.user._id, res);
      const refreshToken = generateRefreshToken(req.user._id, res);
      await User.findByIdAndUpdate(req.user._id, { refreshToken });
      res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`
      );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "ERROR : " + error.message });
    }
  },

  signinFacebook: async (req, res) => {
    try {
      const accessToken = generateTokenAndSetCookie(req.user._id, res);
      const refreshToken = generateRefreshToken(req.user._id, res);
      await User.findByIdAndUpdate(req.user._id, { refreshToken });
      res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`
      );
    } catch (error) {
      console.error("Error during Facebook sign-in:", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "ERROR : " + error.message });
    }
  },
};
export default AuthController;
