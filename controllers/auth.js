import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { signupSchema, signinSchema } from "../schemas/auth.js";
import dotenv from "dotenv";
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
        const isMatch = await bcryptjs.compare(
            req.body.password,
            user.password
        );
        if (!isMatch) {
            return res.status(StatusCodes.BAD_GATEWAY).json({
                message: "Sai mật khẩu !",
            });
        }
        // const token = jwt.sign({ _id: req.body._id }, process.env.SECRET_KEY, {
        //     expiresIn: "7d",
        // });
        return res.status(StatusCodes.ACCEPTED).json({ user });
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
