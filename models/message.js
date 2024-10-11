import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  sender: {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderType: {
      type: String,
      enum: ['User', 'Employee'],
      required: true,
    },
    name: { type: String, required: true },
  },
  content: { type: String, required: true },
  status: { type: String, enum: ['sent', 'read'], default: 'sent' },
  type: {
    type: String,
    enum: ['text', 'product', 'voucher'],
    default: 'text',
  },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  messages: [MessageSchema],
  star: { type: Boolean, default: false },
  label: {
    type: String,
    required: true,
    enum: ['service', 'feedback', 'order'],
    default: 'service',
  }
});

const ConversationModel = mongoose.model('Conversation', ConversationSchema);
export default ConversationModel;
