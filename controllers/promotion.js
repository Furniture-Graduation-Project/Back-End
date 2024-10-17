import { StatusCodes } from "http-status-codes";
import PromotionModel from "../models/promotion.js";
import { promotionSchema } from "../validations/promotion.js";

const PromotionController = {
  create: async (req, res) => {
    const { value, error } = promotionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
    try {
      const promotion = new PromotionModel({
        value,
      });

      await promotion.save();
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Tạo promotion thành công", promotion });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Tạo promotion thất bại", error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const promotions = await PromotionModel.find().populate(
        "productID categoryID"
      );
      res.status(StatusCodes.OK).json(promotions);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lấy danh sách promotion thất bại",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy promotion" });
    }
    try {
      const promotion = await PromotionModel.findById(id).populate(
        "productID categoryID"
      );
      if (!promotion) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy promotion" });
      }
      res.status(StatusCodes.OK).json(promotion);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Lấy promotion thất bại", error: error.message });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy promotion" });
    }
    const { value, error } = promotionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }

    try {
      const promotion = await PromotionModel.findByIdAndUpdate(id, value, {
        new: true,
      });

      if (!promotion) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy promotion" });
      }

      res
        .status(StatusCodes.OK)
        .json({ message: "Cập nhật promotion thành công", promotion });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Cập nhật promotion thất bại", error: error.message });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy promotion" });
    }
    try {
      const promotion = await PromotionModel.findByIdAndDelete(id);
      if (!promotion) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy promotion" });
      }

      res.status(StatusCodes.OK).json({ message: "Xóa promotion thành công" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Xóa promotion thất bại", error: error.message });
    }
  },

  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const promotions = await PromotionModel.find()
        .populate("productID categoryID")
        .skip(skip)
        .limit(limit);

      if (!promotions || promotions.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không có promotion nào." });
      }

      const totalData = await PromotionModel.countDocuments();
      const totalPage = limit ? Math.ceil(totalData / limit) : 1;

      res.status(StatusCodes.OK).json({
        data: promotions,
        totalPage,
        totalData,
        message: "Lấy danh sách promotion thành công.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi lấy thông tin promotion.",
        error: error.message,
      });
    }
  },
};

export default PromotionController;
