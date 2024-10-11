import { StatusCodes } from 'http-status-codes';

import ConversationModel from '../models/message.js';
import { io } from '../services/socket.js';
import { messageSchema } from '../validations/message.js';
import {
  createConversationSchema,
  updateConversationSchema,
} from '../validations/conversation.js';

export const MessageController = {
  getAll: async (req, res) => {
    try {
      const conversation = await ConversationModel.find().populate({
        path: 'userId',
      });
      if (!conversation) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không có cuộc trò chuyện tồn tại.' });
      }
      res.status(StatusCodes.OK).json({
        data: conversation,
        message: 'Lấy tất cả cuộc trò chuyên thành cảnh công.',
      });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Có lỗi xảy ra khi lấy thông tin cuộc trò chuyện.' });
    }
  },
  getLimited: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10);
      const skip = (page - 1) * limit;
      const conversation = await ConversationModel.find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'userId',
        });
      if (!conversation || conversation.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Không có cuộc trò chuyên tồn tại.' });
      }
      const totalConversation = await ConversationModel.countDocuments();
      const totalPages = limit ? Math.ceil(totalConversation / limit) : 1;
      res.status(StatusCodes.OK).json({
        conversation,
        page,
        totalPages,
        totalConversation,
        message: 'Cuộc trò chuyên đã được lấy.',
      });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Có lỗi xảy ra khi lấy thông tin cuộc trò chuyên.' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy cuộc trò chuyên' });
      }

      const conversation = await ConversationModel.findById(id).populate({
        path: 'userId',
      });
      if (!conversation) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Cuộc trò chuyện không tồn tại.' });
      }

      res.status(StatusCodes.OK).json({
        data: conversation,
        message: 'Cuộc trò chuyên đã được lấy.',
      });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Có lỗi xảy ra khi lấy thông tin cuộc trò chuyện.' });
    }
  },

  getByUser: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy cuộc trò chuyên' });
      }

      let conversation = await ConversationModel.findOne({
        userId: id,
      }).populate({
        path: 'userId',
      });
      if (!conversation) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Không tìm thấy cuộc trò chuyên',
        });
      }
      res.status(StatusCodes.OK).json({
        data: conversation,
        message: 'Cuộc trò chuyên đã được lấy.',
      });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Có lỗi xảy ra khi lấy thông tin cuộc trò chuyện.' });
    }
  },

  getByCategory: async (req, res) => {
    try {
      const { category } = req.params;

      if (!category) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy cuộc trò chuyên' });
      }
      const messages = await ConversationModel.find({ category }).populate({
        path: 'userId',
      });

      res.status(StatusCodes.OK).json({
        data: messages,
        message: 'Cuộc trò chuyên đã được lấy.',
      });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  },

  getByStatus: async (req, res) => {
    try {
      const { status } = req.params;

      if (!status) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy cuộc trò chuyên' });
      }
      const messages = await ConversationModel.find({ status }).populate({
        path: 'userId',
      });

      res.status(StatusCodes.OK).json({
        data: messages,
        message: 'Cuộc trò chuyên đã được lấy.',
      });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  },

  getByStar: async (req, res) => {
    try {
      const { star } = req.params;
      if (!star) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy cuộc trò chuyên' });
      }
      const messages = await ConversationModel.find({ star: true });
      res.status(StatusCodes.OK).json({
        data: messages,
        message: 'Cuộc trò chuyên đã được lấy.',
      });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  },

  getByLabel: async (req, res) => {
    try {
      const { label } = req.params;

      if (!label) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy cuộc trò chuyên' });
      }
      const messages = await ConversationModel.find({ label }).populate({
        path: 'userId',
      });

      res.status(StatusCodes.OK).json({
        data: messages,
        message: 'Cuộc trò chuyên đã được lấy.',
      });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  },
  createConversation: async (req, res) => {
    try {
      const { userId, label, category, status } = req.body;
      const { value, error } = createConversationSchema.validate(
        {
          userId,
          label,
          category,
          status,
        },
        { abortEarly: false, stripUnknown: true },
      );
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      const conversation = await ConversationModel.findOne({
        userId: value.userId,
      });
      if (conversation) {
        return res.status(StatusCodes.CONFLICT).json({
          message: 'Cuộc trò chuyện đã tồn tại.',
          conversation,
        });
      }
      const newConversation = new ConversationModel({
        ...value,
      });
      await newConversation.save();
      res.status(StatusCodes.CREATED).json(newConversation);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra khi tạo cuộc trò chuyện.',
        error: error.message,
      });
    }
  },
  updateConversation: async (req, res) => {
    try {
      const { id } = req.params;
      const { label, category, status, star } = req.body;
      const { value, error } = updateConversationSchema.validate(
        {
          label,
          category,
          status,
          star,
        },
        { abortEarly: false, stripUnknown: true },
      );
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      const updatedConversation = await ConversationModel.findByIdAndUpdate(
        id,
        value,
        { new: true, runValidators: true },
      );

      if (!updatedConversation) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Cuộc trò chuyện không tồn tại.' });
      }

      res.status(StatusCodes.OK).json(updatedConversation);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra khi cập nhật cuộc trò chuyện.',
        error: error.message,
      });
    }
  },
  addMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const { sender, content, type } = req.body;
      const { value, error } = messageSchema.validate(
        {
          sender,
          content,
          type,
        },
        { abortEarly: false, stripUnknown: true },
      );
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }

      const conversation = await ConversationModel.findOne({ userId: id });
      if (!conversation) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Cuộc trò chuyện không tồn tại.' });
      }
      const newMessage = {
        sender: value.sender,
        content: value.content,
        type: value.type,
        timestamp: new Date(),
      };
      conversation.messages.push(newMessage);
      await conversation.save();
      io.emit(String(conversation._id), newMessage);
      res.status(StatusCodes.OK).json(newMessage);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra khi thêm tin nhắn vào cuộc trò chuyện.',
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Không tìm thấy cuộc trò chuyên' });
      }
      const conversation = await ConversationModel.findByIdAndDelete(id);
      if (!conversation) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Cuộc trò chuyện không tồn tại.' });
      }
      res
        .status(StatusCodes.OK)
        .json({ message: 'Cuộc trò chuyện đã được xóa thành công.' });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Có lỗi xảy ra khi xóa cuộc trò chuyện.' });
    }
  },
};
