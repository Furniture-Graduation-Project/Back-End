import Voucher from "../models/voucherModel.js";
import { StatusCodes } from "http-status-codes";

export const createVoucher = async (req, res) => {
  const {
    code,
    description,
    type,
    value,
    startDate,
    endDate,
    usageLimit,
    status,
    products,
    categories,
    orders,
  } = req.body;

  try {
    const voucher = new Voucher({
      code,
      description,
      type,
      value,
      startDate,
      endDate,
      usageLimit,
      status,
      products,
      categories,
      orders, // Thêm orders vào khi tạo voucher
    });

    await voucher.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Tạo voucher thành công", voucher });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Tạo voucher thất bại", error });
  }
};

export const getVouchers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const vouchers = await Voucher.find()
      .skip(skip)
      .limit(limit)
      .populate("orders"); // Populate orders
    const total = await Voucher.countDocuments();
    res.status(StatusCodes.OK).json({
      vouchers,
      page,
      totalPages: Math.ceil(total / limit),
      totalVouchers: total,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lấy danh sách voucher thất bại", error });
  }
};

export const getVoucherById = async (req, res) => {
  const { id } = req.params;

  try {
    const voucher = await Voucher.findById(id).populate("orders"); // Populate orders
    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy voucher" });
    }
    res.status(StatusCodes.OK).json(voucher);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lấy voucher thất bại", error });
  }
};

export const updateVoucher = async (req, res) => {
  const { id } = req.params;
  const {
    code,
    description,
    type,
    value,
    startDate,
    endDate,
    usageLimit,
    status,
    products,
    categories,
    orders,
  } = req.body;

  try {
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy voucher" });
    }

    voucher.code = code;
    voucher.description = description;
    voucher.type = type;
    voucher.value = value;
    voucher.startDate = startDate;
    voucher.endDate = endDate;
    voucher.usageLimit = usageLimit;
    voucher.status = status;
    voucher.products = products;
    voucher.categories = categories;
    voucher.orders = orders; // Cập nhật orders

    await voucher.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Cập nhật voucher thành công", voucher });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Cập nhật voucher thất bại", error });
  }
};

export const deleteVoucher = async (req, res) => {
  const { id } = req.params;

  try {
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy voucher" });
    }

    await voucher.remove();
    res.status(StatusCodes.OK).json({ message: "Xóa voucher thành công" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Xóa voucher thất bại", error });
  }
};
