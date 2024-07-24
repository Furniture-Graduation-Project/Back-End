import { StatusCodes } from "http-status-codes";
import Comment from "../models/comment.js";
import { crudValidate } from "../validations/comment.js";

export const getAllComment = async (req, res) => {
  try {
    const comments = await Comment.find();
    return res.status(StatusCodes.OK).json({
      message: "Get All Comments Done",
      data: comments,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const getDetailComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Comment not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Get Detail Comment Done",
      data: comment,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { error } = crudValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors,
      });
    }
    const comment = await Comment.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "Create Comment Done",
      data: comment,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const editComment = async (req, res) => {
  try {
    const { error } = crudValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors,
      });
    }
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Comment not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Update Comment Done",
      data: comment,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Comment not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Delete Comment Done",
      data: comment,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
