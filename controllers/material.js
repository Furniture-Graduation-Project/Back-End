import { StatusCodes } from 'http-status-codes';
import Material from '../models/material.js';
import {
  createMaterialSchema,
  updateMaterialSchema,
} from '../validations/material.js';

const MaterialController = {
  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) + 1 || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const materials = await Material.find().skip(skip).limit(limit);

      if (!materials || materials.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không có nguyên liệu nào.' });
      }

      const totalData = await Material.countDocuments();
      const totalPage = limit ? Math.ceil(totalData / limit) : 1;

      res.status(StatusCodes.OK).json({
        data: materials,
        totalPage,
        totalData,
        message: 'Lấy danh sách nguyên liệu thành công.',
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra khi lấy thông tin nguyên liệu.',
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { error } = createMaterialSchema.validate(req.body);
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          details: error.details.map((err) => err.message),
        });
      }

      const existingMaterial = await Material.findOne({
        materialName: req.body.materialName,
      });
      if (existingMaterial) {
        return res.status(StatusCodes.CONFLICT).json({
          message: 'Nguyên liệu đã tồn tại.',
        });
      }

      const newMaterial = new Material(req.body);
      await newMaterial.save();

      return res.status(StatusCodes.CREATED).json({
        message: 'Tạo nguyên liệu thành công.',
        data: newMaterial,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra khi tạo nguyên liệu.',
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const materials = await Material.find({});
      if (materials.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không có nguyên liệu nào!' });
      }
      return res.status(StatusCodes.OK).json({
        data: materials,
        message: 'Lấy danh sách nguyên liệu.',
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },

  getMaterialById: async (req, res) => {
    try {
      const { id } = req.params;
      const material = await Material.findById(id);
      if (!material) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không tìm thấy nguyên liệu!' });
      }
      return res.status(StatusCodes.OK).json({
        data: material,
        message: 'Lấy nguyên liệu thành côn.',
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },

  updateMaterialById: async (req, res) => {
    try {
      const { error } = updateMaterialSchema.validate(req.body);
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          details: error.details.map((err) => err.message),
        });
      }

      const { id } = req.params;
      const updatedMaterial = await Material.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedMaterial) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không tìm thấy nguyên liệu để cập nhật!' });
      }
      return res.status(StatusCodes.OK).json(updatedMaterial);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  },

  searchByName: async (req, res) => {
    try {
      const { materialName } = req.query;
      if (!materialName) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Thiếu tham số materialName trong yêu cầu.',
        });
      }

      const materials = await Material.find({
        materialName: { $regex: materialName, $options: 'i' },
      });

      if (materials.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Không tìm thấy nguyên liệu nào.' });
      }

      return res.status(StatusCodes.OK).json({
        data: materials,
        message: 'Tìm kiếm nguyên liệu thành công.',
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra khi tìm kiếm nguyên liệu.',
        error: error.message,
      });
    }
  },
};

export default MaterialController;
