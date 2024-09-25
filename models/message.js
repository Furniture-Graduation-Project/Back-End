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
    avatar: { type: String },
  },
  content: { type: String, required: true },
  status: { type: String, enum: ['sent', 'received', 'read', ], default: 'sent' },
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
  },
  status: {
    type: String,
    enum: ['normal', 'spam', 'important', 'deleted'],
    default: 'normal',
  },
  category: {
    type: String,
    enum: ['inbox', 'sent', 'draft'],
    default: 'draft',
  },
});

const ConversationModel = mongoose.model('Conversation', ConversationSchema);
export default ConversationModel;
