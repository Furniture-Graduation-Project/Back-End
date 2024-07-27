import Promotion from "../models/promotionModel.js";
import { StatusCodes } from "http-status-codes";

export const createPromotion = async (req, res) => {
  const {
    description,
    type,
    value,
    startDate,
    endDate,
    productID,
    categoryID,
  } = req.body;

  try {
    const promotion = new Promotion({
      description,
      type,
      value,
      startDate,
      endDate,
      productID,
      categoryID,
    });

    await promotion.save();
    res.status(StatusCodes.CREATED).json({ message: "Tạo promotion thành công", promotion });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Tạo promotion thất bại", error: error.message });
  }
};

export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate("productID categoryID");
    res.status(StatusCodes.OK).json(promotions);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lấy danh sách promotion thất bại", error: error.message });
  }
};

export const getPromotionById = async (req, res) => {
  const { id } = req.params;

  try {
    const promotion = await Promotion.findById(id).populate("productID categoryID");
    if (!promotion) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy promotion" });
    }
    res.status(StatusCodes.OK).json(promotion);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lấy promotion thất bại", error: error.message });
  }
};

export const updatePromotion = async (req, res) => {
  const { id } = req.params;
  const {
    description,
    type,
    value,
    startDate,
    endDate,
    productID,
    categoryID,
  } = req.body;

  try {
    const promotion = await Promotion.findByIdAndUpdate(id, {
      description,
      type,
      value,
      startDate,
      endDate,
      productID,
      categoryID,
    }, { new: true });

    if (!promotion) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy promotion" });
    }

    res.status(StatusCodes.OK).json({ message: "Cập nhật promotion thành công", promotion });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Cập nhật promotion thất bại", error: error.message });
  }
};

export const deletePromotion = async (req, res) => {
  const { id } = req.params;

  try {
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy promotion" });
    }

    res.status(StatusCodes.OK).json({ message: "Xóa promotion thành công" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Xóa promotion thất bại", error: error.message });
  }
};
