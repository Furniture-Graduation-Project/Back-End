import VoucherModel from '../models/voucher.js';
import { StatusCodes } from 'http-status-codes';
import { voucherSchema } from '../validations/voucher.js';

const VoucherController = {
  create: async (req, res) => {
    const { value, error } = voucherSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
    try {
      const voucher = new VoucherModel(value);

      await voucher.save();
      res
        .status(StatusCodes.CREATED)
        .json({ message: 'Tạo voucher thành công', voucher });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Tạo voucher thất bại', error: error.message });
    }
  },

  getAll: async (req, res) => {
    const page = parseInt(req.query.page, 10) + 1 || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    try {
      const vouchers = await VoucherModel.find()
        .skip(skip)
        .limit(limit)
        .populate('orders');
      const total = await VoucherModel.countDocuments();
      res.status(StatusCodes.OK).json({
        vouchers,
        page,
        totalPage: Math.ceil(total / limit),
        totalData: total,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Lấy danh sách voucher thất bại',
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy voucher' });
    }
    try {
      const voucher = await VoucherModel.findById(id).populate('orders');
      if (!voucher) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không tìm thấy voucher' });
      }
      res.status(StatusCodes.OK).json(voucher);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Lấy voucher thất bại', error: error.message });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy voucher' });
    }
    const { value, error } = voucherSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
    try {
      const voucher = await VoucherModel.findByIdAndUpdate(id, value, {
        new: true,
      });

      if (!voucher) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không tìm thấy voucher' });
      }

      res
        .status(StatusCodes.OK)
        .json({ message: 'Cập nhật voucher thành công', voucher });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Cập nhật voucher thất bại', error: error.message });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tìm thấy voucher' });
    }
    try {
      const voucher = await VoucherModel.findByIdAndDelete(id);
      if (!voucher) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không tìm thấy voucher' });
      }

      res.status(StatusCodes.OK).json({ message: 'Xóa voucher thành công' });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Xóa voucher thất bại', error: error.message });
    }
  },
};

export default VoucherController;
